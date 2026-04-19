'use client';

import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CalendarDays, ImagePlus, MapPinned, Trash2, Upload, Users, Clock3, X } from 'lucide-react';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { PageSkeleton } from '@components/ui/PageSkeleton';
import { ActionStatusModal } from '@components/ui/ActionStatusModal';
import { GooglePlaceAutocompleteInput } from '@components/maps/GooglePlaceAutocompleteInput';
import { getCategories } from '@lib/api/categories';
import {
  deleteMyOrganizerEvent,
  getMyOrganizerEventById,
  updateMyOrganizerEvent,
} from '@lib/api/organizerEvents';
import type { CategoryItem } from '@mytypes/category';
import type { EventItem } from '@mytypes/event';

interface FormState {
  title: string;
  description: string;
  categoryId: string;
  venue: string;
  address: string;
  city: string;
  startsAt: string;
  endsAt: string;
  price: string;
  pax: string;
}

function toDateTimeLocal(value: string | Date) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function buildInitialForm(event: EventItem): FormState {
  return {
    title: event.title,
    description: event.description,
    categoryId: String(event.categoryId),
    venue: event.venue,
    address: event.address,
    city: event.city,
    startsAt: toDateTimeLocal(event.startsAt),
    endsAt: toDateTimeLocal(event.endsAt),
    price: String(event.price),
    pax: String(event.pax),
  };
}

function formatPrice(price: number) {
  if (price <= 0) return 'Free';
  return `$${price.toFixed(2)}`;
}

export default function OrganizerEventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = Number(params.id);

  const [event, setEvent] = useState<EventItem | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [saveMessageType, setSaveMessageType] = useState<'success' | 'error' | ''>('');

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        setError('');

        if (Number.isNaN(eventId)) {
          throw new Error('Invalid event id');
        }

        const [eventResult, categoryResult] = await Promise.all([
          getMyOrganizerEventById(eventId),
          getCategories(),
        ]);

        setEvent(eventResult);
        setForm(buildInitialForm(eventResult));
        setCategories(categoryResult.items);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load organizer event'
        );
      } finally {
        setLoading(false);
      }
    }

    void loadPage();
  }, [eventId]);

  useEffect(() => {
    return () => {
      if (bannerPreviewUrl) {
        URL.revokeObjectURL(bannerPreviewUrl);
      }
    };
  }, [bannerPreviewUrl]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    if (!form) return;

    setForm((prev) =>
      prev
        ? {
            ...prev,
            [key]: value,
          }
        : prev
    );
  }

  function handleBannerChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (bannerPreviewUrl) {
      URL.revokeObjectURL(bannerPreviewUrl);
    }

    if (!file) {
      setBannerFile(null);
      setBannerPreviewUrl('');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setBannerFile(file);
    setBannerPreviewUrl(previewUrl);
  }

  function clearBannerSelection() {
    if (bannerPreviewUrl) {
      URL.revokeObjectURL(bannerPreviewUrl);
    }

    setBannerFile(null);
    setBannerPreviewUrl('');
  }

  function validateForm(): string {
    if (!form) return 'Form is not ready.';
    if (!form.title.trim()) return 'Title is required.';
    if (!form.description.trim()) return 'Description is required.';
    if (!form.categoryId) return 'Category is required.';
    if (!form.venue.trim()) return 'Venue is required.';
    if (!form.address.trim()) return 'Address is required.';
    if (!form.city.trim()) return 'City is required.';
    if (!form.startsAt) return 'Start date and time is required.';
    if (!form.endsAt) return 'End date and time is required.';

    const startsAt = new Date(form.startsAt);
    const endsAt = new Date(form.endsAt);
    const price = Number(form.price);
    const pax = Number(form.pax);

    if (Number.isNaN(startsAt.getTime())) return 'Start date and time is invalid.';
    if (Number.isNaN(endsAt.getTime())) return 'End date and time is invalid.';
    if (endsAt <= startsAt) return 'End date and time must be after start date and time.';
    if (Number.isNaN(price) || price < 0) return 'Price must be 0 or more.';
    if (Number.isNaN(pax) || pax <= 0) return 'Pax must be greater than 0.';

    return '';
  }

  async function handleSubmit(eventObject: FormEvent<HTMLFormElement>) {
    eventObject.preventDefault();
    if (!form || !event) return;

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSaveMessage('');
      setSaveMessageType('');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSaveMessage('');
      setSaveMessageType('');

      const updated = await updateMyOrganizerEvent(event.id, {
        title: form.title.trim(),
        description: form.description.trim(),
        bannerUrl: event.bannerUrl ?? null,
        categoryId: Number(form.categoryId),
        venue: form.venue.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        startsAt: new Date(form.startsAt).toISOString(),
        endsAt: new Date(form.endsAt).toISOString(),
        price: Number(form.price),
        pax: Number(form.pax),
      });

      setEvent(updated);
      setForm(buildInitialForm(updated));
      clearBannerSelection();

      setSaveMessage('Event updated successfully.');
      setSaveMessageType('success');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update event';

      setError(message);
      setSaveMessage(message);
      setSaveMessageType('error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteEvent() {
    if (!event) return;

    try {
      setDeleteLoading(true);
      setError('');

      await deleteMyOrganizerEvent(event.id);
      router.replace('/organizer/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      setDeleteLoading(false);
      setDeleteModalOpen(false);
    }
  }

  const selectedCategoryName = useMemo(() => {
    if (!form?.categoryId) return '';
    return categories.find((item) => item.id === Number(form.categoryId))?.name || '';
  }, [categories, form?.categoryId]);

  if (loading) {
    return <PageSkeleton />;
  }

  if (error && !event) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Organizer Event</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage and update your event details.
          </p>
        </div>

        <Card>
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      </div>
    );
  }

  if (!event || !form) {
    return null;
  }

  const currentBanner = bannerPreviewUrl || event.bannerUrl || '';
  const eventStarted = new Date(event.startsAt) <= new Date();

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Manage Event
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Update your event details, review attendees, or delete the event.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={`/organizer/events/${event.id}/bookings`}>
              <Button variant="secondary" className="w-auto px-4 py-2">
                <span className="flex items-center gap-2">
                  <Users size={16} />
                  View Bookings
                </span>
              </Button>
            </Link>

            <Link href={`/organizer/events/${event.id}/waitlists`}>
              <Button variant="secondary" className="w-auto px-4 py-2">
                <span className="flex items-center gap-2">
                  <Clock3 size={16} />
                  View Waitlists
                </span>
              </Button>
            </Link>

            <Button
              variant="secondary"
              className="w-auto px-4 py-2"
              onClick={() => setDeleteModalOpen(true)}
            >
              <span className="flex items-center gap-2">
                <Trash2 size={16} />
                Delete Event
              </span>
            </Button>
          </div>
        </div>

        <Card>
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Event Snapshot
              </h2>

              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="space-y-2 border-slate-200 p-4 text-sm text-slate-600">
                  <p>
                    <span className="font-medium text-slate-900">Title:</span>{' '}
                    {event.title}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Category:</span>{' '}
                    {event.categoryName || '-'}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Price:</span>{' '}
                    {formatPrice(event.price)}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Pax:</span>{' '}
                    {event.pax}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Booked:</span>{' '}
                    {event.totalBookings ?? 0}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Started:</span>{' '}
                    {eventStarted ? 'Yes' : 'No'}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Suspended:</span>{' '}
                    {event.isSuspended ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Banner Image
              </h2>

              <div className="mt-4 overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                <div className="aspect-[16/9] w-full bg-slate-100">
                  {currentBanner ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentBanner}
                      alt="Banner preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-500">
                      <ImagePlus size={28} />
                      <p className="text-sm">No banner selected</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 bg-white p-4">
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                    <span className="flex items-center gap-2">
                      <Upload size={16} />
                      Choose File
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      className="hidden"
                    />
                  </label>

                  {bannerFile || bannerPreviewUrl ? (
                    <button
                      type="button"
                      onClick={clearBannerSelection}
                      className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <span className="flex items-center gap-2">
                        <X size={16} />
                        Remove
                      </span>
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Card>
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Basic Details
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Title
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Enter event title"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={7}
                    placeholder="Describe your event"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Category
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => updateField('categoryId', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {selectedCategoryName ? (
                    <p className="mt-2 text-xs text-slate-500">
                      Selected: {selectedCategoryName}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-slate-500" />
                    <span className="text-sm font-medium text-slate-800">
                      Event Status
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p>
                      Started: <span className="font-medium text-slate-900">{eventStarted ? 'Yes' : 'No'}</span>
                    </p>
                    <p>
                      Bookings: <span className="font-medium text-slate-900">{event.totalBookings ?? 0}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <MapPinned size={18} className="text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Venue Details
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Venue Search
                  </label>
                  <GooglePlaceAutocompleteInput
                    value={form.venue}
                    onChange={(value) => updateField('venue', value)}
                    onPlaceSelected={({ venue, address, city }) => {
                      updateField('venue', venue);
                      if (address) {
                        updateField('address', address);
                      }
                      if (city) {
                        updateField('city', city);
                      }
                    }}
                    placeholder="Search venue or address"
                    disabled={saving}
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Search for the venue of your event.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Venue Name
                  </label>
                  <input
                    value={form.venue}
                    onChange={(e) => updateField('venue', e.target.value)}
                    placeholder="Venue name"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    City
                  </label>
                  <input
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="City"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Address
                  </label>
                  <input
                    value={form.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="Street address"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Schedule & Capacity
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Starts At
                  </label>
                  <input
                    type="datetime-local"
                    value={form.startsAt}
                    onChange={(e) => updateField('startsAt', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Ends At
                  </label>
                  <input
                    type="datetime-local"
                    value={form.endsAt}
                    onChange={(e) => updateField('endsAt', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => updateField('price', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Pax
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.pax}
                    onChange={(e) => updateField('pax', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                  />
                </div>
              </div>
            </div>
          </Card>

          {error ? (
            <Card>
              <p className="text-sm text-red-600">{error}</p>
            </Card>
          ) : null}

          {saveMessage ? (
            <p
              className={`text-sm ${saveMessageType === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
            >
              {saveMessage}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" className="w-auto px-5" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>

            <Link href={`/events/${event.id}`}>
              <Button type="button" variant="secondary" className="w-auto px-5">
                View Public Event
              </Button>
            </Link>

            <Link href="/organizer/events">
              <Button type="button" variant="secondary" className="w-auto px-5">
                Back to Events
              </Button>
            </Link>
          </div>
        </form>
      </div>

      <ActionStatusModal
        open={deleteModalOpen}
        title="Delete event"
        description={`You are about to delete ${event.title}. This will remove the event and affect existing bookings and waitlists.`}
        details={
          <p>
            This action cannot be undone. Users with bookings may be refunded
            according to backend rules.
          </p>
        }
        message={deleteLoading ? 'Deleting event...' : ''}
        messageTone="neutral"
        confirmLabel="Delete Event"
        hideConfirm={false}
        isLoading={deleteLoading}
        onConfirm={handleDeleteEvent}
        onClose={() => {
          if (!deleteLoading) {
            setDeleteModalOpen(false);
          }
        }}
      />
    </>
  );
}
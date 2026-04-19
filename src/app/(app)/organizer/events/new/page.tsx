'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, MapPinned, Upload, X } from 'lucide-react';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { PageSkeleton } from '@components/ui/PageSkeleton';
import { GooglePlaceAutocompleteInput } from '@components/maps/GooglePlaceAutocompleteInput';
import { getCategories } from '@lib/api/categories';
import {
  createOrganizerEvent,
  type CreateOrganizerEventInput,
} from '@lib/api/organizerEvents';
import type { CategoryItem } from '@mytypes/category';

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

const initialForm: FormState = {
  title: '',
  description: '',
  categoryId: '',
  venue: '',
  address: '',
  city: '',
  startsAt: '',
  endsAt: '',
  price: '0',
  pax: '1',
};

export default function OrganizerCreateEventPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string>('');

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        setError('');

        const result = await getCategories();
        setCategories(result.items);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load categories'
        );
      } finally {
        setLoading(false);
      }
    }

    void loadCategories();
  }, []);

  useEffect(() => {
    return () => {
      if (bannerPreviewUrl) {
        URL.revokeObjectURL(bannerPreviewUrl);
      }
    };
  }, [bannerPreviewUrl]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
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

  function clearBanner() {
    if (bannerPreviewUrl) {
      URL.revokeObjectURL(bannerPreviewUrl);
    }

    setBannerFile(null);
    setBannerPreviewUrl('');
  }

  function validateForm(): string {
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
    if (endsAt <= startsAt) {
      return 'End date and time must be after start date and time.';
    }
    if (Number.isNaN(price) || price < 0) return 'Price must be 0 or more.';
    if (Number.isNaN(pax) || pax <= 0) return 'Pax must be greater than 0.';

    return '';
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const payload: CreateOrganizerEventInput = {
        title: form.title.trim(),
        description: form.description.trim(),
        bannerUrl: null,
        categoryId: Number(form.categoryId),
        venue: form.venue.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        startsAt: new Date(form.startsAt).toISOString(),
        endsAt: new Date(form.endsAt).toISOString(),
        price: Number(form.price),
        pax: Number(form.pax),
      };

      const created = await createOrganizerEvent(payload);
      router.replace(`/organizer/events/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  }

  const selectedCategoryName = useMemo(() => {
    if (!form.categoryId) return '';
    return categories.find((item) => item.id === Number(form.categoryId))?.name || '';
  }, [categories, form.categoryId]);

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Create Event</h1>
        <p className="mt-1 text-sm text-slate-600">
          Create a new event for attendees to discover and book.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div>
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

              <div>
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
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Banner Image
              </label>

              <div className="overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                <div className="aspect-[16/9] w-full bg-slate-100">
                  {bannerPreviewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={bannerPreviewUrl}
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

                  {bannerFile ? (
                    <button
                      type="button"
                      onClick={clearBanner}
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
                  disabled={submitting}
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

        <div className="flex flex-wrap gap-3">
          <Button type="submit" className="w-auto px-5" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Event'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-auto px-5"
            onClick={() => router.push('/organizer/events')}
            disabled={submitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
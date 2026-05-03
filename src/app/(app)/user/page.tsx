'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { useAppSession } from '@lib/session/AppSessionContext';
import { updateMyProfile } from '@lib/api/user';
import { uploadImage } from '@lib/api/uploads';
import type { UpdateMyProfileInput, UserGender, UserProfile } from '@mytypes/user';

type FormState = {
  name: string;
  description: string;
  gender: '' | UserGender;
  age: string;
};

function buildInitialForm(profile: UserProfile): FormState {
  return {
    name: profile.name ?? '',
    description: profile.description ?? '',
    gender: profile.gender ?? '',
    age: profile.age !== null && profile.age !== undefined ? String(profile.age) : '',
  };
}

function isSameForm(a: FormState, b: FormState): boolean {
  return (
    a.name === b.name &&
    a.description === b.description &&
    a.gender === b.gender &&
    a.age === b.age
  );
}

export default function UserPage() {
  const { profile, setProfile } = useAppSession();

  const [form, setForm] = useState<FormState>(() => buildInitialForm(profile));
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadedProfilePicUrl, setUploadedProfilePicUrl] = useState<string | null>(
    profile.profilePicUrl ?? null
  );
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setForm(buildInitialForm(profile));
    setUploadedProfilePicUrl(profile.profilePicUrl ?? null);
  }, [profile]);

  const initialForm = useMemo(() => buildInitialForm(profile), [profile]);
  const hasChanges = useMemo(() => !isSameForm(form, initialForm), [form, initialForm]);
  const hasImageChange = uploadedProfilePicUrl !== (profile.profilePicUrl ?? null);
  const canSubmit = hasChanges || hasImageChange;

  function handleChange(key: keyof FormState, value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setError('');
    setSuccessMsg('');
  }

  async function handleProfilePicChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    try {
      setIsUploadingImage(true);
      setError('');
      setSuccessMsg('');

      const result = await uploadImage(file, 'profile');
      setUploadedProfilePicUrl(result.url);
      setSuccessMsg('Profile image uploaded. Click Save Changes to persist it.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload profile image');
    } finally {
      setIsUploadingImage(false);
      event.target.value = '';
    }
  }

  async function handleSubmit() {
    try {
      setIsSaving(true);
      setError('');
      setSuccessMsg('');

      const trimmedName = form.name.trim();
      const trimmedDescription = form.description.trim();
      const trimmedGender = form.gender;
      const trimmedAge = form.age.trim();

      const payload: UpdateMyProfileInput = {};

      if (trimmedName !== initialForm.name) {
        payload.name = trimmedName;
      }

      if (trimmedDescription !== initialForm.description) {
        payload.description = trimmedDescription ? trimmedDescription : null;
      }

      if (trimmedGender !== initialForm.gender) {
        payload.gender = trimmedGender ? trimmedGender : null;
      }

      if (trimmedAge !== initialForm.age) {
        payload.age = trimmedAge ? Number(trimmedAge) : null;
      }

      if (uploadedProfilePicUrl !== (profile.profilePicUrl ?? null)) {
        payload.profilePicUrl = uploadedProfilePicUrl;
      }

      const updated = await updateMyProfile(payload);
      setProfile(updated);
      setSuccessMsg('Profile updated successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    setForm(initialForm);
    setUploadedProfilePicUrl(profile.profilePicUrl ?? null);
    setError('');
    setSuccessMsg('');
  }

  const previewUrl = uploadedProfilePicUrl || '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>
        <p className="mt-1 text-sm text-slate-600">
          Update your profile details and keep your information current.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card>
          <div className="space-y-5">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt={form.name || profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-semibold text-slate-400">
                    {(form.name || profile.name || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                {form.name || profile.name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{profile.email}</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Upload profile picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                disabled={isUploadingImage || isSaving}
                className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              />
              {isUploadingImage ? (
                <p className="mt-2 text-xs text-slate-500">Uploading image...</p>
              ) : null}
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <div>
                <span className="font-medium text-slate-900">Email:</span>{' '}
                <span className="text-slate-600">{profile.email}</span>
              </div>
              <div>
                <span className="font-medium text-slate-900">Role:</span>{' '}
                <span className="text-slate-600">{profile.role}</span>
              </div>
              <div>
                <span className="font-medium text-slate-900">Status:</span>{' '}
                <span className="text-slate-600">{profile.status}</span>
              </div>
              <div>
                <span className="font-medium text-slate-900">Credits:</span>{' '}
                <span className="text-slate-600">{profile.credits}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Profile details</h2>
              <p className="mt-1 text-sm text-slate-600">
                Tell others a little more about yourself.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Name
                </label>
                <Input
                  value={form.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Gender
                </label>
                <select
                  value={form.gender}
                  onChange={(event) => handleChange('gender', event.target.value as '' | UserGender)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Age
                </label>
                <Input
                  type="number"
                  min={0}
                  value={form.age}
                  onChange={(event) => handleChange('age', event.target.value)}
                  placeholder="Your age"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(event) => handleChange('description', event.target.value)}
                  rows={6}
                  placeholder="Tell others about yourself"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                />
              </div>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {successMsg ? <p className="text-sm text-green-600">{successMsg}</p> : null}

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                className="w-auto px-5"
                onClick={handleSubmit}
                disabled={!canSubmit || isSaving || isUploadingImage}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="w-auto px-5"
                onClick={handleReset}
                disabled={isSaving || isUploadingImage}
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
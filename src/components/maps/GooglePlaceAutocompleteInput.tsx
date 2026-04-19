'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google?: any;
  }
}

interface PlaceSelection {
  venue: string;
  address: string;
  city: string;
}

interface GooglePlaceAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected: (place: PlaceSelection) => void;
  placeholder?: string;
  disabled?: boolean;
}

const GOOGLE_SCRIPT_ID = 'google-maps-places-script';

function getCityFromAddressComponents(components: any[] = []): string {
  const findComponent = (type: string) =>
    components.find((component) => component.types?.includes(type))?.long_name;

  return (
    findComponent('locality') ||
    findComponent('postal_town') ||
    findComponent('administrative_area_level_2') ||
    findComponent('administrative_area_level_1') ||
    ''
  );
}

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Google Maps can only load in the browser.'));
      return;
    }

    if (window.google?.maps?.places) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(
      GOOGLE_SCRIPT_ID
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () =>
        reject(new Error('Failed to load Google Maps script.'))
      );
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Failed to load Google Maps script.'));

    document.head.appendChild(script);
  });
}

export function GooglePlaceAutocompleteInput({
  value,
  onChange,
  onPlaceSelected,
  placeholder = 'Search venue or address',
  disabled = false,
}: GooglePlaceAutocompleteInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function setupAutocomplete() {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        return;
      }

      try {
        await loadGoogleMapsScript(apiKey);

        if (!isMounted || !inputRef.current || !window.google?.maps?.places) {
          return;
        }

        if (autocompleteRef.current) {
          return;
        }

        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            fields: ['name', 'formatted_address', 'address_components'],
            types: ['establishment', 'geocode'],
          }
        );

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();

          const venue = place?.name || inputRef.current?.value || '';
          const address = place?.formatted_address || '';
          const city = getCityFromAddressComponents(place?.address_components);

          onChange(venue);
          onPlaceSelected({
            venue,
            address,
            city,
          });
        });

        autocompleteRef.current = autocomplete;
      } catch {
        // Fail silently and let the user type manually.
      }
    }

    void setupAutocomplete();

    return () => {
      isMounted = false;
    };
  }, [onChange, onPlaceSelected]);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-100"
    />
  );
}
const TOKEN_KEY = 'jwt_token';

interface JwtPayload {
  userId?: number;
  email?: string;
  role?: 'user' | 'organizer' | 'admin';
  exp?: number;
  iat?: number;
}

function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');

    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = window.atob(normalized);
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export const tokenStorage = {
  get(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },

  set(token: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(TOKEN_KEY, token);
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(TOKEN_KEY);
  },

  getPayload(): JwtPayload | null {
    if (typeof window === 'undefined') return null;

    const token = window.localStorage.getItem(TOKEN_KEY);

    if (!token) {
      return null;
    }

    return parseJwtPayload(token);
  },
};
'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { styles } from '@/styles/styles';
import { login } from '@/lib/api/auth';
import { tokenStorage } from '@/lib/auth/token';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      tokenStorage.set(result.token);
      router.push('/user');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={`${styles.layout.page} ${styles.layout.center}`}>
      <div className={styles.layout.container}>
        <Card>
          <h1 className={styles.text.title}>Login</h1>
          <p className={styles.text.subtitle}>
            Sign in with your email and password.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className={styles.text.label}>Email</label>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="john@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className={styles.text.label}>Password</label>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error ? <p className={styles.text.error}>{error}</p> : null}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Login'}
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-slate-900 underline underline-offset-2"
            >
              Register
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
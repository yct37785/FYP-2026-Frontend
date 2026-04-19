'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { styles } from '@/styles/styles';
import { register } from '@/lib/api/auth';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'organizer'>('user');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await register({
        name,
        email,
        password,
        role,
      });

      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={`${styles.layout.page} ${styles.layout.center}`}>
      <div className={styles.layout.container}>
        <Card>
          <h1 className={styles.text.title}>Register</h1>
          <p className={styles.text.subtitle}>
            Create an account to start browsing or organizing events.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className={styles.text.label}>Name</label>
              <Input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Mary Lee"
                autoComplete="name"
              />
            </div>

            <div>
              <label className={styles.text.label}>Email</label>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="mary@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className={styles.text.label}>Password</label>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className={styles.text.label}>Role</label>
              <select
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as 'user' | 'organizer')
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
              >
                <option value="user">User</option>
                <option value="organizer">Organizer</option>
              </select>
            </div>

            {error ? <p className={styles.text.error}>{error}</p> : null}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Register'}
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-slate-900 underline underline-offset-2"
            >
              Login
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
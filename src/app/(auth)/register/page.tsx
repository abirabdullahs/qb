'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const rawText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error('Server returned an unexpected response. Please try again.');
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
      <div className="app-container" style={{ maxWidth: '480px' }}>
        <div className="card">
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
            Register Account
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
            Create your free Student account to practice questions and save bookmarks for revision.
          </p>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Tanvir Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ padding: '0.65rem 0.85rem', background: '#F0F4F1', borderRadius: '8px', border: '1px solid #A7C4A0', fontSize: '0.8rem', color: '#2D3748', marginBottom: '1rem' }}>
              <strong>Note:</strong> Public registrations are automatically assigned the <strong>Student</strong> role. Staff accounts (Admin, Moderator, Contributor) are managed by site administrators.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            >
              {loading ? 'Creating Account...' : 'Register as Student'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#2563eb', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

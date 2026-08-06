'use client';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main>
      <section className="container">
        <h1>Something went wrong!</h1>
        <p>{error.message || 'An unexpected error occurred.'}</p>
        <button
          onClick={() => reset()}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
          }}
        >
          Try again
        </button>
      </section>
    </main>
  );
}

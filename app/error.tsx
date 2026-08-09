"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-12">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-sm">{error.message}</p>
      <button type="button" onClick={reset} className="border px-4 py-2">
        Try again
      </button>
    </div>
  );
}

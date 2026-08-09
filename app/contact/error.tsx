"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-12">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <button type="button" onClick={reset} className="border px-4 py-2">
        Try again
      </button>
    </div>
  );
}

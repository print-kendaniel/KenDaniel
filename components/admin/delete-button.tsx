"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteButton({ url, label = "Delete" }: { url: string; label?: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure? This cannot be undone.")) return;

    setIsDeleting(true);
    try {
      await fetch(url, { method: "DELETE" });
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button type="button" onClick={handleDelete} disabled={isDeleting} className="border px-3 py-1 text-sm">
      {isDeleting ? "Deleting…" : label}
    </button>
  );
}

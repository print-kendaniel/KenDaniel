"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Message } from "@/types/message";

export function MessageRow({ message }: { message: Message }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  async function toggleRead() {
    setIsUpdating(true);
    try {
      await fetch(`/api/messages/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !message.read }),
      });
      router.refresh();
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <li className="flex flex-col gap-2 border p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">
            {message.subject} {!message.read && <span className="text-xs">(unread)</span>}
          </p>
          <p className="text-sm">
            {message.name} &lt;{message.email}&gt;
          </p>
        </div>
        <button type="button" onClick={toggleRead} disabled={isUpdating} className="border px-3 py-1 text-sm">
          {message.read ? "Mark unread" : "Mark read"}
        </button>
      </div>
      <p className="text-sm">{message.message}</p>
      <p className="text-xs">{new Date(message.createdAt).toLocaleString()}</p>
    </li>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await signOut(firebaseAuth);
    router.push("/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={handleLogout} className="border px-3 py-1 text-sm">
      Log out
    </button>
  );
}

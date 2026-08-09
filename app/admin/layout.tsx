import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/guard";
import { LogoutButton } from "@/components/admin/logout-button";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="flex items-center justify-between border-b pb-4">
        <nav className="flex gap-4 text-sm">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/projects">Projects</Link>
          <Link href="/admin/blog">Blog</Link>
          <Link href="/admin/messages">Messages</Link>
        </nav>
        <LogoutButton />
      </header>
      <main>{children}</main>
    </div>
  );
}

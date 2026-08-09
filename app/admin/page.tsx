import Link from "next/link";
import { listProjects, listPosts, listMessages } from "@/lib/firebase/firestore";

export default async function AdminDashboardPage() {
  const [projects, posts, messages] = await Promise.all([listProjects(), listPosts(), listMessages()]);
  const unreadCount = messages.filter((message) => !message.read).length;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/admin/projects" className="border p-4">
          <p className="text-2xl font-semibold">{projects.length}</p>
          <p className="text-sm">Projects</p>
        </Link>
        <Link href="/admin/blog" className="border p-4">
          <p className="text-2xl font-semibold">{posts.length}</p>
          <p className="text-sm">Blog posts</p>
        </Link>
        <Link href="/admin/messages" className="border p-4">
          <p className="text-2xl font-semibold">{unreadCount}</p>
          <p className="text-sm">Unread messages</p>
        </Link>
      </div>
    </div>
  );
}

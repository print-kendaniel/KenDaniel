import Link from "next/link";
import { listPosts } from "@/lib/firebase/firestore";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminBlogPage() {
  const posts = await listPosts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Blog posts</h1>
        <Link href="/admin/blog/new" className="border px-4 py-2">
          New post
        </Link>
      </div>

      <ul className="flex flex-col gap-2">
        {posts.map((post) => (
          <li key={post.id} className="flex items-center justify-between border p-3">
            <div>
              <p className="font-semibold">{post.title}</p>
              <p className="text-sm">
                /{post.slug} · {post.published ? "Published" : "Draft"}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/blog/${post.id}`} className="border px-3 py-1 text-sm">
                Edit
              </Link>
              <DeleteButton url={`/api/blog/${post.id}`} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

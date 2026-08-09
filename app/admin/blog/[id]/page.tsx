import { notFound } from "next/navigation";
import { getPostById } from "@/lib/firebase/firestore";
import { PostForm } from "@/components/admin/post-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Edit post</h1>
      <PostForm mode="edit" post={post} />
    </div>
  );
}

import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">New post</h1>
      <PostForm mode="create" />
    </div>
  );
}

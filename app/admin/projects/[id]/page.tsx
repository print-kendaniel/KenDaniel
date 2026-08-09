import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/firebase/firestore";
import { ProjectForm } from "@/components/admin/project-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Edit project</h1>
      <ProjectForm mode="edit" project={project} />
    </div>
  );
}

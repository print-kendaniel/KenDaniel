import Link from "next/link";
import { listProjects } from "@/lib/firebase/firestore";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminProjectsPage() {
  const projects = await listProjects();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Link href="/admin/projects/new" className="border px-4 py-2">
          New project
        </Link>
      </div>

      <ul className="flex flex-col gap-2">
        {projects.map((project) => (
          <li key={project.id} className="flex items-center justify-between border p-3">
            <div>
              <p className="font-semibold">{project.title}</p>
              <p className="text-sm">/{project.slug}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/projects/${project.id}`} className="border px-3 py-1 text-sm">
                Edit
              </Link>
              <DeleteButton url={`/api/projects/${project.id}`} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

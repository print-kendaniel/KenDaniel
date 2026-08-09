"use client";

import { useRouter } from "next/navigation";
import { Dock, type DockItemData } from "@/components/effects/dock";
import { useContactModal } from "@/components/contact/contact-modal-context";
import { HomeIcon, FolderIcon, UserIcon, FileTextIcon, MailIcon } from "@/components/ui/icons";

export function SiteDock() {
  const router = useRouter();
  const { openContactModal } = useContactModal();

  const items: DockItemData[] = [
    { icon: <HomeIcon className="size-full" />, label: "Home", onClick: () => router.push("/") },
    { icon: <FolderIcon className="size-full" />, label: "Projects", onClick: () => router.push("/projects") },
    { icon: <UserIcon className="size-full" />, label: "About", onClick: () => router.push("/about") },
    { icon: <FileTextIcon className="size-full" />, label: "Blog", onClick: () => router.push("/blog") },
    { icon: <MailIcon className="size-full" />, label: "Contact", onClick: openContactModal },
  ];

  return <Dock items={items} panelHeight={60} baseItemSize={42} magnification={62} distance={140} />;
}

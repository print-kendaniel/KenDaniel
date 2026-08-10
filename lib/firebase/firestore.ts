import "server-only";
import {
  FieldValue,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { adminFirestore } from "@/lib/firebase/admin";
import type { Project, ProjectInput, ProjectUpdate } from "@/lib/validation/project.schema";
import type { Post, PostInput, PostUpdate } from "@/lib/validation/post.schema";
import type { Message, MessageInput } from "@/lib/validation/message.schema";

const projectsCollection = adminFirestore.collection("projects");
const postsCollection = adminFirestore.collection("posts");
const messagesCollection = adminFirestore.collection("messages");

function toIso(value: Timestamp | Date | null | undefined): string | null {
  if (!value) return null;
  return value instanceof Timestamp ? value.toDate().toISOString() : value.toISOString();
}

function projectFromDoc(doc: QueryDocumentSnapshot<DocumentData>): Project {
  const data = doc.data();
  return {
    id: doc.id,
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    description: data.description,
    techStack: data.techStack ?? [],
    repoUrl: data.repoUrl ?? null,
    liveUrl: data.liveUrl ?? null,
    coverImage: data.coverImage ?? null,
    featured: Boolean(data.featured),
    order: data.order ?? 0,
    createdAt: toIso(data.createdAt) ?? new Date(0).toISOString(),
    updatedAt: toIso(data.updatedAt) ?? new Date(0).toISOString(),
  };
}

function postFromDoc(doc: QueryDocumentSnapshot<DocumentData>): Post {
  const data = doc.data();
  return {
    id: doc.id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    tags: data.tags ?? [],
    published: Boolean(data.published),
    publishedAt: toIso(data.publishedAt),
    createdAt: toIso(data.createdAt) ?? new Date(0).toISOString(),
    updatedAt: toIso(data.updatedAt) ?? new Date(0).toISOString(),
  };
}

function messageFromDoc(doc: QueryDocumentSnapshot<DocumentData>): Message {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
    read: Boolean(data.read),
    ipHash: data.ipHash,
    createdAt: toIso(data.createdAt) ?? new Date(0).toISOString(),
  };
}

// --- Projects ---

export async function listProjects(): Promise<Project[]> {
  const snapshot = await projectsCollection.orderBy("order", "asc").get();
  return snapshot.docs.map(projectFromDoc);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const snapshot = await projectsCollection.where("slug", "==", slug).limit(1).get();
  if (snapshot.empty) return null;
  return projectFromDoc(snapshot.docs[0]);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const doc = await projectsCollection.doc(id).get();
  if (!doc.exists) return null;
  return projectFromDoc(doc as QueryDocumentSnapshot<DocumentData>);
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const now = FieldValue.serverTimestamp();
  const ref = await projectsCollection.add({ ...input, createdAt: now, updatedAt: now });
  const created = await getProjectById(ref.id);
  if (!created) throw new Error("Failed to read back created project");
  return created;
}

export async function updateProject(id: string, patch: ProjectUpdate): Promise<void> {
  await projectsCollection.doc(id).update({ ...patch, updatedAt: FieldValue.serverTimestamp() });
}

export async function deleteProject(id: string): Promise<void> {
  await projectsCollection.doc(id).delete();
}

// --- Posts ---

export async function listPosts(): Promise<Post[]> {
  const snapshot = await postsCollection.orderBy("createdAt", "desc").get();
  return snapshot.docs.map(postFromDoc);
}

export async function listPublishedPosts(): Promise<Post[]> {
  const snapshot = await postsCollection
    .where("published", "==", true)
    .orderBy("publishedAt", "desc")
    .get();
  return snapshot.docs.map(postFromDoc);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const snapshot = await postsCollection.where("slug", "==", slug).limit(1).get();
  if (snapshot.empty) return null;
  return postFromDoc(snapshot.docs[0]);
}

export async function getPostById(id: string): Promise<Post | null> {
  const doc = await postsCollection.doc(id).get();
  if (!doc.exists) return null;
  return postFromDoc(doc as QueryDocumentSnapshot<DocumentData>);
}

export async function createPost(input: PostInput): Promise<Post> {
  const now = FieldValue.serverTimestamp();
  const ref = await postsCollection.add({
    ...input,
    publishedAt: input.published ? now : null,
    createdAt: now,
    updatedAt: now,
  });
  const created = await getPostById(ref.id);
  if (!created) throw new Error("Failed to read back created post");
  return created;
}

export async function updatePost(id: string, patch: PostUpdate): Promise<void> {
  const updates: Record<string, unknown> = { ...patch, updatedAt: FieldValue.serverTimestamp() };
  if (patch.published === true) {
    updates.publishedAt = FieldValue.serverTimestamp();
  }
  await postsCollection.doc(id).update(updates);
}

export async function deletePost(id: string): Promise<void> {
  await postsCollection.doc(id).delete();
}

// --- Messages ---

export async function listMessages(): Promise<Message[]> {
  const snapshot = await messagesCollection.orderBy("createdAt", "desc").get();
  return snapshot.docs.map(messageFromDoc);
}

export async function createMessage(
  input: MessageInput,
  ipHash: string,
): Promise<Message> {
  const ref = await messagesCollection.add({
    ...input,
    read: false,
    ipHash,
    createdAt: FieldValue.serverTimestamp(),
  });
  const doc = await ref.get();
  return messageFromDoc(doc as QueryDocumentSnapshot<DocumentData>);
}

export async function markMessageRead(id: string, read: boolean): Promise<void> {
  await messagesCollection.doc(id).update({ read });
}

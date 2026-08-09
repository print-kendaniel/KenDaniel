import { z } from "zod";

export const messageSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  email: z.email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
  read: z.boolean(),
  ipHash: z.string().min(1),
  createdAt: z.iso.datetime(),
});

export type Message = z.infer<typeof messageSchema>;

export const messageInputSchema = messageSchema.omit({
  id: true,
  read: true,
  ipHash: true,
  createdAt: true,
});

export type MessageInput = z.infer<typeof messageInputSchema>;

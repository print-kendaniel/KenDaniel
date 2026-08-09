import { listMessages } from "@/lib/firebase/firestore";
import { MessageRow } from "@/components/admin/message-row";

export default async function AdminMessagesPage() {
  const messages = await listMessages();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Messages</h1>
      {messages.length === 0 ? (
        <p className="text-sm">No messages yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {messages.map((message) => (
            <MessageRow key={message.id} message={message} />
          ))}
        </ul>
      )}
    </div>
  );
}

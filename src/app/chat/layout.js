import { ChatTopBar } from "@/components/chat/ChatTopBar";

export default function ChatLayout({ children }) {
  return (
    <div className="flex h-screen flex-col">
      <ChatTopBar />
      <div className="flex flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

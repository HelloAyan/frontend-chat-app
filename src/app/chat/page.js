"use client";

import { useMemo, useState } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { CURRENT_USER, MOCK_USERS, MOCK_CONVERSATIONS, MOCK_MESSAGES } from "@/lib/mockChatData";
import { cn } from "@/lib/cn";

// Everything below is local state over mock data, just to get the UI right
// first. Next step swaps this for redux (conversations/messages slices) and
// the real REST + socket calls — none of src/components/chat should need to
// change for that, they only know about the props they're given.
export default function ChatPage() {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [messagesByConversation, setMessagesByConversation] = useState(MOCK_MESSAGES);
  const [activeId, setActiveId] = useState(null);

  const activeConversation = conversations.find((c) => c._id === activeId) ?? null;

  const activeMessages = useMemo(() => {
    if (!activeConversation) return [];
    const raw = messagesByConversation[activeConversation._id] ?? [];
    if (activeConversation.type !== "group") return raw;

    // the server only ever gives back a sender id, group bubbles need a name
    // to show above other people's messages
    const nameById = new Map(activeConversation.participants.map((p) => [p._id, p.name]));
    return raw.map((message) => ({ ...message, senderName: nameById.get(message.sender) }));
  }, [activeConversation, messagesByConversation]);

  function handleStartConversation(user) {
    const existing = conversations.find((c) => c.type === "direct" && c.participant._id === user._id);
    if (existing) {
      setActiveId(existing._id);
      return;
    }

    const newConversation = {
      _id: `local-${user._id}`,
      type: "direct",
      participant: user,
      lastMessage: null,
      updatedAt: new Date().toISOString(),
    };
    setConversations((prev) => [newConversation, ...prev]);
    setMessagesByConversation((prev) => ({ ...prev, [newConversation._id]: [] }));
    setActiveId(newConversation._id);
  }

  function handleCreateGroup({ name, participantIds }) {
    const members = MOCK_USERS.filter((user) => participantIds.includes(user._id));
    const newGroup = {
      _id: `local-group-${Date.now()}`,
      type: "group",
      name,
      createdBy: CURRENT_USER._id,
      admins: [CURRENT_USER._id],
      participants: [CURRENT_USER, ...members],
      lastMessage: null,
      updatedAt: new Date().toISOString(),
    };
    setConversations((prev) => [newGroup, ...prev]);
    setMessagesByConversation((prev) => ({ ...prev, [newGroup._id]: [] }));
    setActiveId(newGroup._id);
  }

  function handleSendMessage(text) {
    if (!activeConversation) return;

    const message = {
      _id: `local-msg-${Date.now()}`,
      conversation: activeConversation._id,
      sender: CURRENT_USER._id,
      text,
      createdAt: new Date().toISOString(),
    };

    setMessagesByConversation((prev) => ({
      ...prev,
      [activeConversation._id]: [...(prev[activeConversation._id] ?? []), message],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c._id === activeConversation._id
          ? { ...c, lastMessage: { text, sender: CURRENT_USER._id, createdAt: message.createdAt }, updatedAt: message.createdAt }
          : c,
      ),
    );
  }

  return (
    <>
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        currentUserId={CURRENT_USER._id}
        isLoading={false}
        users={MOCK_USERS}
        onSelectConversation={setActiveId}
        onStartConversation={handleStartConversation}
        onCreateGroup={handleCreateGroup}
        className={cn("w-full md:w-[340px]", activeId && "hidden md:flex")}
      />
      <ChatPanel
        conversation={activeConversation}
        messages={activeMessages}
        currentUserId={CURRENT_USER._id}
        isLoadingMessages={false}
        onBack={() => setActiveId(null)}
        onSendMessage={handleSendMessage}
        className={cn(!activeId && "hidden md:flex")}
      />
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { useCurrentUser } from "@/features/auth/hooks";
import { useGetConversationsQuery, useStartConversationMutation } from "@/features/conversations/api";
import { MOCK_USERS } from "@/lib/mockChatData";
import { cn } from "@/lib/cn";

// Creating a group and sending a message are still mock/local (their own
// API steps haven't landed yet), so anything created that way lives in
// localConversations until it does. It's merged with the real fetched list
// below rather than replacing it. Starting a direct conversation is real
// now: it seeds an optimistic entry under the server's own id, so once the
// invalidated refetch brings back the full conversation the merge below
// swaps it in automatically instead of leaving a duplicate.
export default function ChatPage() {
  const { data: currentUser } = useCurrentUser();
  const {
    data: fetchedConversations,
    isLoading: isLoadingConversations,
    isError: isConversationsError,
    refetch: refetchConversations,
  } = useGetConversationsQuery();
  const [startConversation] = useStartConversationMutation();

  const [localConversations, setLocalConversations] = useState([]);
  const [messagesByConversation, setMessagesByConversation] = useState({});
  const [activeId, setActiveId] = useState(null);

  const conversations = useMemo(() => {
    const fetchedIds = new Set((fetchedConversations ?? []).map((c) => c._id));
    const stillLocal = localConversations.filter((c) => !fetchedIds.has(c._id));
    return [...stillLocal, ...(fetchedConversations ?? [])];
  }, [fetchedConversations, localConversations]);

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

  async function handleStartConversation(user) {
    const existing = conversations.find((c) => c.type === "direct" && c.participant._id === user._id);
    if (existing) {
      setActiveId(existing._id);
      return;
    }

    try {
      const result = await startConversation(user._id).unwrap();
      // POST /conversations only returns { _id, participants, createdAt },
      // not the full shape GET /conversations gives back, so this fills in
      // the rest from the user we already have on hand (search result)
      const optimisticConversation = {
        _id: result._id,
        type: "direct",
        participant: user,
        lastMessage: null,
        updatedAt: result.createdAt,
      };
      setLocalConversations((prev) => [optimisticConversation, ...prev]);
      setMessagesByConversation((prev) => ({ ...prev, [result._id]: [] }));
      setActiveId(result._id);
    } catch (err) {
      toast.error(err.message || "Couldn't start the conversation, please try again.");
    }
  }

  function handleCreateGroup({ name, participantIds }) {
    const members = MOCK_USERS.filter((user) => participantIds.includes(user._id));
    const newGroup = {
      _id: `local-group-${Date.now()}`,
      type: "group",
      name,
      createdBy: currentUser?._id,
      admins: [currentUser?._id],
      participants: [currentUser, ...members],
      lastMessage: null,
      updatedAt: new Date().toISOString(),
    };
    setLocalConversations((prev) => [newGroup, ...prev]);
    setMessagesByConversation((prev) => ({ ...prev, [newGroup._id]: [] }));
    setActiveId(newGroup._id);
  }

  function handleSendMessage(text) {
    if (!activeConversation || !currentUser) return;

    const message = {
      _id: `local-msg-${Date.now()}`,
      conversation: activeConversation._id,
      sender: currentUser._id,
      text,
      createdAt: new Date().toISOString(),
    };

    setMessagesByConversation((prev) => ({
      ...prev,
      [activeConversation._id]: [...(prev[activeConversation._id] ?? []), message],
    }));

    setLocalConversations((prev) =>
      prev.map((c) =>
        c._id === activeConversation._id
          ? { ...c, lastMessage: { text, sender: currentUser._id, createdAt: message.createdAt }, updatedAt: message.createdAt }
          : c,
      ),
    );
  }

  return (
    <>
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        currentUserId={currentUser?._id}
        isLoading={isLoadingConversations}
        isError={isConversationsError}
        onRetry={refetchConversations}
        groupMemberOptions={MOCK_USERS}
        onSelectConversation={setActiveId}
        onStartConversation={handleStartConversation}
        onCreateGroup={handleCreateGroup}
        className={cn("w-full md:w-[340px]", activeId && "hidden md:flex")}
      />
      <ChatPanel
        conversation={activeConversation}
        messages={activeMessages}
        currentUserId={currentUser?._id}
        isLoadingMessages={false}
        onBack={() => setActiveId(null)}
        onSendMessage={handleSendMessage}
        className={cn(!activeId && "hidden md:flex")}
      />
    </>
  );
}

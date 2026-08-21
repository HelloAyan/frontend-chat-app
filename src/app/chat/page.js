"use client";

import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { useCurrentUser } from "@/features/auth/hooks";
import { useGetConversationsQuery, useStartConversationMutation, conversationsApi } from "@/features/conversations/api";
import { useGetMessagesInfiniteQuery, useSendMessageMutation } from "@/features/messages/api";
import { MOCK_USERS } from "@/lib/mockChatData";
import { cn } from "@/lib/cn";

// Creating a group and sending a message are still mock/local (their own
// API steps haven't landed yet), so anything created that way lives in
// localConversations/messagesByConversation until it does. Both get merged
// with real fetched data below rather than replacing it. A "local-group-"
// id is the only kind of conversation that's still entirely mock; anything
// else (fetched, or started for real in step 3) fetches its real history.
export default function ChatPage() {
  const { data: currentUser } = useCurrentUser();
  const {
    data: fetchedConversations,
    isLoading: isLoadingConversations,
    isError: isConversationsError,
    refetch: refetchConversations,
  } = useGetConversationsQuery();
  const [startConversation] = useStartConversationMutation();
  const [sendMessage] = useSendMessageMutation();
  const dispatch = useDispatch();

  const [localConversations, setLocalConversations] = useState([]);
  const [messagesByConversation, setMessagesByConversation] = useState({});
  const [activeId, setActiveId] = useState(null);

  const conversations = useMemo(() => {
    const fetchedIds = new Set((fetchedConversations ?? []).map((c) => c._id));
    const stillLocal = localConversations.filter((c) => !fetchedIds.has(c._id));
    return [...stillLocal, ...(fetchedConversations ?? [])];
  }, [fetchedConversations, localConversations]);

  const activeConversation = conversations.find((c) => c._id === activeId) ?? null;
  const isMockOnlyConversation = activeConversation?._id.startsWith("local-group-") ?? true;

  const {
    data: messagesPages,
    isLoading: isLoadingMessages,
    isFetchingNextPage: isLoadingOlderMessages,
    isError: isMessagesError,
    hasNextPage: hasMoreOlderMessages,
    fetchNextPage: loadOlderMessages,
    refetch: refetchMessages,
  } = useGetMessagesInfiniteQuery(isMockOnlyConversation ? skipToken : activeConversation._id);

  const activeMessages = useMemo(() => {
    if (!activeConversation) return [];

    const localOnly = messagesByConversation[activeConversation._id] ?? [];
    // pages arrive newest-page-first, and each page is newest-message-first
    // internally, reversing the whole flattened run puts everything in one
    // consistent oldest-to-newest order for rendering top to bottom. the
    // API's `before` cursor is inclusive rather than exclusive, so the
    // oldest message of one page shows up again as the newest message of
    // the next, the Map dedupes that (keeping the first position it saw,
    // which is what reverse() needs to end up in the right spot)
    const fetched = messagesPages
      ? Array.from(new Map(messagesPages.pages.flatMap((page) => page.messages).map((m) => [m._id, m])).values()).reverse()
      : [];
    // a message just sent through appendMessage() below lives here under
    // its real id until the next full refetch brings it back through
    // `fetched` too, drop the local copy once that happens so it isn't
    // shown twice
    const fetchedIds = new Set(fetched.map((m) => m._id));
    const stillLocalOnly = localOnly.filter((m) => !fetchedIds.has(m._id));
    const raw = isMockOnlyConversation ? localOnly : [...fetched, ...stillLocalOnly];

    if (activeConversation.type !== "group") return raw;

    // the server only ever gives back a sender id, group bubbles need a name
    // to show above other people's messages
    const nameById = new Map(activeConversation.participants.map((p) => [p._id, p.name]));
    return raw.map((message) => ({ ...message, senderName: nameById.get(message.sender) }));
  }, [activeConversation, isMockOnlyConversation, messagesPages, messagesByConversation]);

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

  // updates wherever this conversation's preview line lives: the RTK Query
  // cache if it came from GET /conversations, the local overlay if it's
  // still only known client-side (e.g. a just-started chat before its
  // refetch lands). harmless to do both, the merge above always prefers
  // whichever one is real.
  function updateConversationPreview(conversationId, message) {
    const preview = { text: message.text, sender: message.sender, createdAt: message.createdAt };

    dispatch(
      conversationsApi.util.updateQueryData("getConversations", undefined, (draft) => {
        const conversation = draft.find((c) => c._id === conversationId);
        if (conversation) {
          conversation.lastMessage = preview;
          conversation.updatedAt = message.createdAt;
        }
      }),
    );

    setLocalConversations((prev) =>
      prev.map((c) => (c._id === conversationId ? { ...c, lastMessage: preview, updatedAt: message.createdAt } : c)),
    );
  }

  function appendMessage(conversationId, message) {
    setMessagesByConversation((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] ?? []), message],
    }));
    updateConversationPreview(conversationId, message);
  }

  async function handleSendMessage(text) {
    if (!activeConversation || !currentUser) return;

    if (isMockOnlyConversation) {
      appendMessage(activeConversation._id, {
        _id: `local-msg-${Date.now()}`,
        conversation: activeConversation._id,
        sender: currentUser._id,
        text,
        createdAt: new Date().toISOString(),
      });
      return;
    }

    try {
      const result = await sendMessage({ conversationId: activeConversation._id, text }).unwrap();
      if (!result) {
        // documented API quirk: an unknown conversationId gets a 200 with a
        // null body instead of an error. shouldn't happen for a
        // conversation that's already open, but the frontend can't assume
        // it never will
        throw new Error("Message couldn't be sent, please try again.");
      }
      appendMessage(activeConversation._id, result);
    } catch (err) {
      toast.error(err.message || "Couldn't send that message, please try again.");
    }
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
        isLoadingMessages={!isMockOnlyConversation && isLoadingMessages}
        isMessagesError={!isMockOnlyConversation && isMessagesError}
        onRetryMessages={refetchMessages}
        hasMoreOlderMessages={!isMockOnlyConversation && hasMoreOlderMessages}
        isLoadingOlderMessages={isLoadingOlderMessages}
        onLoadOlderMessages={loadOlderMessages}
        onBack={() => setActiveId(null)}
        onSendMessage={handleSendMessage}
        className={cn(!activeId && "hidden md:flex")}
      />
    </>
  );
}

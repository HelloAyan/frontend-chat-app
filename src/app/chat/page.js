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
import { useMessageSocket } from "@/features/messages/hooks";
import {
  useCreateGroupMutation,
  useAddParticipantsMutation,
  useRemoveParticipantMutation,
  usePromoteAdminMutation,
} from "@/features/groups/api";
import { getTokenCookie } from "@/lib/cookies";
import { cn } from "@/lib/cn";

// Everything a user does here (start a chat, create a group, send a
// message) hits the real API. Anything just created client side lives in
// localConversations/messagesByConversation only until the next fetch
// brings back the authoritative version, at which point the merges below
// drop the local copy automatically by matching on the server's own id.
export default function ChatPage() {
  const { data: currentUser } = useCurrentUser();
  const {
    data: fetchedConversations,
    isLoading: isLoadingConversations,
    isError: isConversationsError,
    refetch: refetchConversations,
  } = useGetConversationsQuery();
  const [startConversation] = useStartConversationMutation();
  const [createGroup, { isLoading: isCreatingGroup }] = useCreateGroupMutation();
  const [addParticipants, { isLoading: isAddingMembers }] = useAddParticipantsMutation();
  const [removeParticipant] = useRemoveParticipantMutation();
  const [promoteAdmin] = usePromoteAdminMutation();
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

  const {
    data: messagesPages,
    isLoading: isLoadingMessages,
    isFetchingNextPage: isLoadingOlderMessages,
    isError: isMessagesError,
    hasNextPage: hasMoreOlderMessages,
    fetchNextPage: loadOlderMessages,
    refetch: refetchMessages,
  } = useGetMessagesInfiniteQuery(activeConversation ? activeConversation._id : skipToken);

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
    // a message sitting only in the local overlay (just sent, or delivered
    // over the socket) drops out here once the same id shows up in a real
    // fetch, so it isn't shown twice
    const fetchedIds = new Set(fetched.map((m) => m._id));
    const stillLocalOnly = localOnly.filter((m) => !fetchedIds.has(m._id));
    const raw = [...fetched, ...stillLocalOnly];

    if (activeConversation.type !== "group") return raw;

    // the server only ever gives back a sender id, group bubbles need a name
    // to show above other people's messages
    const nameById = new Map(activeConversation.participants.map((p) => [p._id, p.name]));
    return raw.map((message) => ({ ...message, senderName: nameById.get(message.sender) }));
  }, [activeConversation, messagesPages, messagesByConversation]);

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

  async function handleCreateGroup({ name, participantIds }) {
    try {
      // unlike POST /conversations, this one already returns the full
      // Conversation shape, nothing needs filling in
      const group = await createGroup({ name, participantIds }).unwrap();
      setLocalConversations((prev) => [group, ...prev]);
      setMessagesByConversation((prev) => ({ ...prev, [group._id]: [] }));
      setActiveId(group._id);
      return true;
    } catch (err) {
      toast.error(err.message || "Couldn't create the group, please try again.");
      return false;
    }
  }

  // applies `patch` wherever this conversation currently lives: the RTK
  // Query cache if it came from GET /conversations, the local overlay if
  // it's still only known client-side (e.g. just created, refetch not
  // landed yet). harmless to do both, the merge above always prefers
  // whichever one is real. `patch` is a plain object or an updater function
  // (conversation) => partial object, for patches that depend on the
  // current value (e.g. appending to a list).
  function patchConversation(conversationId, patch) {
    function resolve(conversation) {
      return typeof patch === "function" ? patch(conversation) : patch;
    }

    dispatch(
      conversationsApi.util.updateQueryData("getConversations", undefined, (draft) => {
        const conversation = draft.find((c) => c._id === conversationId);
        if (conversation) Object.assign(conversation, resolve(conversation));
      }),
    );

    setLocalConversations((prev) =>
      prev.map((c) => (c._id === conversationId ? { ...c, ...resolve(c) } : c)),
    );
  }

  function updateConversationPreview(conversationId, message) {
    patchConversation(conversationId, {
      lastMessage: { text: message.text, sender: message.sender, createdAt: message.createdAt },
      updatedAt: message.createdAt,
    });
  }

  async function handleAddMembers(userIds) {
    if (!activeConversation) return false;

    try {
      const updated = await addParticipants({ conversationId: activeConversation._id, userIds }).unwrap();
      patchConversation(activeConversation._id, { participants: updated.participants, admins: updated.admins });
      return true;
    } catch (err) {
      toast.error(err.message || "Couldn't add members, please try again.");
      return false;
    }
  }

  // drops a conversation from every place this component tracks it, used
  // when leaving a group means it shouldn't show up here at all anymore
  function removeConversationFromView(conversationId) {
    dispatch(
      conversationsApi.util.updateQueryData("getConversations", undefined, (draft) => {
        const index = draft.findIndex((c) => c._id === conversationId);
        if (index !== -1) draft.splice(index, 1);
      }),
    );
    setLocalConversations((prev) => prev.filter((c) => c._id !== conversationId));
    setMessagesByConversation((prev) => {
      const next = { ...prev };
      delete next[conversationId];
      return next;
    });
  }

  async function handleRemoveMember(userId) {
    if (!activeConversation) return;

    try {
      const updated = await removeParticipant({ conversationId: activeConversation._id, userId }).unwrap();
      patchConversation(activeConversation._id, { participants: updated.participants, admins: updated.admins });
    } catch (err) {
      toast.error(err.message || "Couldn't remove that member, please try again.");
    }
  }

  async function handlePromoteAdmin(userId) {
    if (!activeConversation) return;

    try {
      const updated = await promoteAdmin({ conversationId: activeConversation._id, userId }).unwrap();
      patchConversation(activeConversation._id, { admins: updated.admins });
    } catch (err) {
      toast.error(err.message || "Couldn't promote that member, please try again.");
    }
  }

  async function handleLeaveGroup() {
    if (!activeConversation || !currentUser) return;
    const conversationId = activeConversation._id;

    try {
      await removeParticipant({ conversationId, userId: currentUser._id }).unwrap();
      removeConversationFromView(conversationId);
      setActiveId(null);
      toast.success("You left the group");
    } catch (err) {
      toast.error(err.message || "Couldn't leave the group, please try again.");
    }
  }

  // idempotent by message id: a message this tab just sent over REST also
  // comes back over the socket a moment later (the server broadcasts every
  // new message, including the sender's own), so the second arrival needs
  // to be a no-op instead of a duplicate bubble
  function appendMessage(conversationId, message) {
    setMessagesByConversation((prev) => {
      const existing = prev[conversationId] ?? [];
      if (existing.some((m) => m._id === message._id)) return prev;
      return { ...prev, [conversationId]: [...existing, message] };
    });
    updateConversationPreview(conversationId, message);
  }

  // a message for a conversation we don't know about yet (someone just
  // started chatting with us, or added us to a group) can't be reconstructed
  // from the bare message payload alone, so this just pulls the full list
  // again instead
  function handleIncomingMessage(message) {
    const conversationId = message.conversation;
    const isKnownConversation = conversations.some((c) => c._id === conversationId);

    if (!isKnownConversation) {
      dispatch(conversationsApi.util.invalidateTags(["Conversation"]));
      return;
    }

    appendMessage(conversationId, message);
  }

  useMessageSocket(currentUser ? getTokenCookie() : null, handleIncomingMessage);

  async function handleSendMessage(text) {
    if (!activeConversation || !currentUser) return;

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
        isCreatingGroup={isCreatingGroup}
        onSelectConversation={setActiveId}
        onStartConversation={handleStartConversation}
        onCreateGroup={handleCreateGroup}
        className={cn("w-full md:w-[340px]", activeId && "hidden md:flex")}
      />
      <ChatPanel
        conversation={activeConversation}
        messages={activeMessages}
        currentUserId={currentUser?._id}
        isLoadingMessages={isLoadingMessages}
        isMessagesError={isMessagesError}
        onRetryMessages={refetchMessages}
        hasMoreOlderMessages={hasMoreOlderMessages}
        isLoadingOlderMessages={isLoadingOlderMessages}
        onLoadOlderMessages={loadOlderMessages}
        onBack={() => setActiveId(null)}
        onSendMessage={handleSendMessage}
        onAddMembers={handleAddMembers}
        isAddingMembers={isAddingMembers}
        onRemoveMember={handleRemoveMember}
        onPromoteAdmin={handlePromoteAdmin}
        onLeaveGroup={handleLeaveGroup}
        className={cn(!activeId && "hidden md:flex")}
      />
    </>
  );
}

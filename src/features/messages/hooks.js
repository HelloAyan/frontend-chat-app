"use client";

import { useEffect, useRef } from "react";
import { createSocket } from "@/lib/socket";

// Keeps a single socket connection open for as long as there's a token, and
// always invokes the latest handlers (via a ref) instead of tearing the
// connection down and reconnecting whenever the caller's closures change,
// which would happen almost every render otherwise. Carries both
// message:new and conversation:updated since the server multiplexes both
// over the same connection (this lives in the messages feature since that
// was its first use, not because conversation:updated belongs here).
export function useChatSocket(token, { onMessage, onConversationUpdate }) {
  const handlersRef = useRef({ onMessage, onConversationUpdate });

  useEffect(() => {
    handlersRef.current = { onMessage, onConversationUpdate };
  }, [onMessage, onConversationUpdate]);

  useEffect(() => {
    if (!token) return undefined;

    const socket = createSocket(token);

    function handleNewMessage(rawMessage) {
      // the socket payload doesn't match the REST response for the same
      // message: `id` instead of `_id`, and `createdAt` as a numeric epoch
      // timestamp instead of an ISO string. normalized here so every other
      // message this app touches (REST-fetched or socket-delivered) has one
      // consistent shape.
      handlersRef.current.onMessage?.({
        ...rawMessage,
        _id: rawMessage._id ?? rawMessage.id,
        createdAt:
          typeof rawMessage.createdAt === "number" ? new Date(rawMessage.createdAt).toISOString() : rawMessage.createdAt,
      });
    }

    function handleConversationUpdated(conversation) {
      handlersRef.current.onConversationUpdate?.(conversation);
    }

    socket.on("message:new", handleNewMessage);
    socket.on("conversation:updated", handleConversationUpdated);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("conversation:updated", handleConversationUpdated);
      socket.disconnect();
    };
  }, [token]);
}

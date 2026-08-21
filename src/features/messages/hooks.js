"use client";

import { useEffect, useRef } from "react";
import { createSocket } from "@/lib/socket";

// Keeps a single socket connection open for as long as there's a token, and
// always invokes the latest onMessage callback (via a ref) instead of
// tearing the connection down and reconnecting whenever the caller's
// closure changes, which would happen almost every render otherwise.
export function useMessageSocket(token, onMessage) {
  const handlerRef = useRef(onMessage);

  useEffect(() => {
    handlerRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!token) return undefined;

    const socket = createSocket(token);
    function handleNewMessage(rawMessage) {
      // the socket payload doesn't match the REST response for the same
      // message: `id` instead of `_id`, and `createdAt` as a numeric epoch
      // timestamp instead of an ISO string. normalized here so every other
      // message this app touches (REST-fetched or socket-delivered) has one
      // consistent shape.
      handlerRef.current?.({
        ...rawMessage,
        _id: rawMessage._id ?? rawMessage.id,
        createdAt:
          typeof rawMessage.createdAt === "number" ? new Date(rawMessage.createdAt).toISOString() : rawMessage.createdAt,
      });
    }

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.disconnect();
    };
  }, [token]);
}

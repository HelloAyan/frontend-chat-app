"use client";

import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { DateDivider } from "./DateDivider";
import { NewMessagesPill } from "./NewMessagesPill";
import { Skeleton } from "@/components/ui/Skeleton";
import { dateDividerLabel, isSameDay } from "@/lib/formatMessageTime";
import { cn } from "@/lib/cn";

// how close to the bottom counts as "still anchored" — a few px of slack so
// a stray scroll wheel tick doesn't unpin the view
const BOTTOM_THRESHOLD_PX = 80;

export function MessageList({ messages, currentUserId, isGroup, isLoading }) {
  const scrollRef = useRef(null);
  const previousCount = useRef(messages.length);
  const isPinnedToBottom = useRef(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  // jump to the bottom the moment a conversation opens — no smooth scroll,
  // that would just look like the page is animating for no reason
  useEffect(() => {
    scrollToBottom("auto");
    previousCount.current = messages.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const grew = messages.length > previousCount.current;
    previousCount.current = messages.length;
    if (!grew) return;

    if (isPinnedToBottom.current) {
      scrollToBottom("smooth");
    } else {
      setHasNewMessages(true);
    }
  }, [messages]);

  function scrollToBottom(behavior) {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior });
    setHasNewMessages(false);
  }

  function handleScroll() {
    const node = scrollRef.current;
    if (!node) return;
    const distanceFromBottom = node.scrollHeight - node.scrollTop - node.clientHeight;
    const pinned = distanceFromBottom < BOTTOM_THRESHOLD_PX;
    isPinnedToBottom.current = pinned;
    if (pinned) setHasNewMessages(false);
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col justify-end gap-3 px-4 py-4">
        {[false, true, false, true].map((own, i) => (
          <Skeleton key={i} className={cn("h-10 rounded-2xl", own ? "ml-auto w-1/3" : "w-2/5")} />
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
        <p className="text-sm font-medium text-foreground">No messages yet</p>
        <p className="text-xs text-muted-foreground">Say hi 👋 to start the conversation.</p>
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      <div ref={scrollRef} onScroll={handleScroll} className="h-full overflow-y-auto px-4 py-4">
        {messages.map((message, index) => {
          const previous = messages[index - 1];
          const isOwn = message.sender === currentUserId;
          const isNewDay = !previous || !isSameDay(previous.createdAt, message.createdAt);
          const showSender = isGroup && !isOwn && (isNewDay || previous.sender !== message.sender);

          return (
            <div key={message._id}>
              {isNewDay && <DateDivider label={dateDividerLabel(message.createdAt)} />}
              <div className={cn(showSender || isNewDay ? "mb-3" : "mb-1")}>
                <MessageBubble message={message} isOwn={isOwn} showSender={showSender} senderName={message.senderName} />
              </div>
            </div>
          );
        })}
      </div>

      {hasNewMessages && <NewMessagesPill onClick={() => scrollToBottom("smooth")} />}
    </div>
  );
}

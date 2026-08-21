"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { DateDivider } from "./DateDivider";
import { NewMessagesPill } from "./NewMessagesPill";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { dateDividerLabel, isSameDay } from "@/lib/formatMessageTime";
import { cn } from "@/lib/cn";

// how close to the bottom counts as "still anchored", a few px of slack so
// a stray scroll wheel tick doesn't unpin the view
const BOTTOM_THRESHOLD_PX = 80;
// how close to the top triggers loading the next (older) page
const TOP_THRESHOLD_PX = 60;

export function MessageList({
  messages,
  currentUserId,
  isGroup,
  isLoading,
  isError,
  onRetry,
  hasMoreOlder,
  isLoadingOlder,
  onLoadOlder,
}) {
  const scrollRef = useRef(null);
  const previousCount = useRef(messages.length);
  const previousFirstId = useRef(messages[0]?._id);
  const previousScrollHeight = useRef(0);
  const isPinnedToBottom = useRef(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  // jump to the bottom the moment a conversation opens, no smooth scroll,
  // that would just look like the page is animating for no reason
  useEffect(() => {
    scrollToBottom("auto");
    previousCount.current = messages.length;
    previousFirstId.current = messages[0]?._id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // runs before the browser paints, so it can correct the scroll position
  // in the same frame the new content lands, no visible jump either way
  useLayoutEffect(() => {
    const node = scrollRef.current;
    const grew = messages.length > previousCount.current;
    const grewAtTop = grew && messages[0]?._id !== previousFirstId.current;

    if (grewAtTop && node) {
      // older messages were prepended, keep whatever the user was looking
      // at in the same spot instead of letting the scroll jump to the top
      node.scrollTop = node.scrollHeight - previousScrollHeight.current;
    } else if (grew) {
      if (isPinnedToBottom.current) {
        scrollToBottom("smooth");
      } else {
        setHasNewMessages(true);
      }
    }

    previousCount.current = messages.length;
    previousFirstId.current = messages[0]?._id;
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

    if (node.scrollTop < TOP_THRESHOLD_PX && hasMoreOlder && !isLoadingOlder) {
      previousScrollHeight.current = node.scrollHeight;
      onLoadOlder?.();
    }
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

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
        <p className="text-sm font-medium text-foreground">Couldn&rsquo;t load this conversation</p>
        <p className="text-xs text-muted-foreground">Check your connection and try again.</p>
        <Button type="button" variant="secondary" onClick={onRetry} className="mt-1">
          Retry
        </Button>
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
        {isLoadingOlder && (
          <div className="flex justify-center pb-3">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          </div>
        )}

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

"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

const MAX_TEXTAREA_HEIGHT_PX = 128;

export function MessageComposer({ onSend, disabled }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  function resizeTextarea(node) {
    node.style.height = "auto";
    node.style.height = `${Math.min(node.scrollHeight, MAX_TEXTAREA_HEIGHT_PX)}px`;
  }

  function handleChange(event) {
    setText(event.target.value);
    resizeTextarea(event.target);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return; // empty messages don't go anywhere, per the brief

    onSend(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-border bg-card p-3">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="Type a message..."
        disabled={disabled}
        className="max-h-32 flex-1 resize-none rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
      />
      <Button
        type="submit"
        disabled={disabled || !text.trim()}
        className="h-10 w-10 shrink-0 !px-0"
        aria-label="Send message"
      >
        <SendIcon />
      </Button>
    </form>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22 11 13 2 9z" />
    </svg>
  );
}

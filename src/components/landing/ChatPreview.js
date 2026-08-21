import { Avatar } from "@/components/shared/Avatar";
import { cn } from "@/lib/cn";

/**
 * Static showcase of the chat panel — mock data only, no store, no API, no
 * socket. Reuses the real app's visual language (bubble tokens, Avatar,
 * corner radii) so it actually looks like the product, not a lookalike.
 *
 * @param {Object} props
 * @param {string} props.eyebrow
 * @param {string} props.title
 * @param {string} props.description
 * @param {import("@/lib/landingContent").PreviewConversation[]} props.conversations
 */
export function ChatPreview({ eyebrow, title, description, conversations }) {
  const active = conversations.find((conversation) => conversation.isActive) ?? conversations[0];

  return (
    <section id="chat-preview" className="px-6 py-20 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow && (
            <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {eyebrow}
            </span>
          )}
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground text-balance">{description}</p>
        </div>

        <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div className="flex h-[560px] flex-col sm:flex-row">
            <aside className="flex shrink-0 flex-col border-b border-border sm:h-full sm:w-64 sm:border-b-0 sm:border-r">
              <div className="hidden items-center gap-2 border-b border-border px-4 py-3.5 sm:flex">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[11px] font-semibold text-primary-foreground">
                  T
                </span>
                <span className="text-xs font-semibold text-foreground">Threadly</span>
              </div>

              {/* mobile: compact horizontal strip instead of the full list, so the
                  chat thread itself still gets most of the vertical space */}
              <div className="flex gap-4 overflow-x-auto px-4 py-3 sm:hidden">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "flex shrink-0 flex-col items-center gap-1",
                      conversation.id !== active.id && "opacity-60",
                    )}
                  >
                    <ConversationAvatar participant={conversation.participant} />
                    <span className="max-w-[52px] truncate text-[10px] text-muted-foreground">
                      {conversation.participant.name.split(" ")[0]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="hidden flex-1 space-y-0.5 overflow-y-auto p-2 sm:block">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2.5",
                      conversation.id === active.id && "bg-secondary",
                    )}
                  >
                    <ConversationAvatar participant={conversation.participant} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-1.5">
                        <p className="truncate text-sm font-medium text-foreground">{conversation.participant.name}</p>
                        <span className="shrink-0 text-[11px] text-muted-foreground">{conversation.lastMessageTime}</span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{conversation.lastMessage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            <div className="flex flex-1 flex-col">
              <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
                <ConversationAvatar participant={active.participant} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{active.participant.name}</p>
                  <p className="text-xs text-muted-foreground">{active.participant.isOnline ? "Active now" : "Offline"}</p>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {active.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex flex-col", message.direction === "outgoing" ? "items-end" : "items-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                        message.direction === "outgoing"
                          ? "rounded-br-sm bg-bubble-own text-bubble-own-foreground"
                          : "rounded-bl-sm bg-bubble-other text-bubble-other-foreground",
                      )}
                    >
                      {message.text}
                    </div>
                    <span className="mt-0.5 px-1 text-[11px] text-muted-foreground">{message.time}</span>
                  </div>
                ))}
              </div>

              {/* non-interactive on purpose, this is a showcase, not the real composer */}
              <div className="border-t border-border px-4 py-3">
                <div className="rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-muted-foreground">
                  Type a message...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * @param {Object} props
 * @param {import("@/lib/landingContent").PreviewParticipant} props.participant
 */
function ConversationAvatar({ participant }) {
  return (
    <div className="relative shrink-0">
      <Avatar name={participant.name} size="sm" />
      {participant.isOnline && (
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
      )}
    </div>
  );
}

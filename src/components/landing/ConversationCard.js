import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Reusable showcase card for one conversation type (direct or group). All
 * copy, participants, and preview messages come from props — nothing about
 * a specific conversation is hardcoded here, so the same card renders
 * either type from lib/landingContent.js data alone.
 *
 * @param {Object} props
 * @param {"direct"|"group"} props.type
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} props.metadata
 * @param {import("@/lib/landingContent").ConversationParticipant[]} props.participants
 * @param {number} [props.totalParticipantCount]
 * @param {import("@/lib/landingContent").ConversationPreviewMessage[]} props.previewMessages
 */
export function ConversationCard({
  type,
  title,
  description,
  metadata,
  participants,
  totalParticipantCount,
  previewMessages,
}) {
  const isGroup = type === "group";
  const overflowCount = isGroup ? Math.max((totalParticipantCount ?? participants.length) - participants.length, 0) : 0;

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-4">
        {isGroup ? (
          <div className="flex shrink-0 -space-x-2">
            {participants.map((participant) => (
              <ParticipantAvatar key={participant.id} participant={participant} size={32} ringed />
            ))}
            {overflowCount > 0 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-secondary text-[11px] font-medium text-secondary-foreground">
                +{overflowCount}
              </div>
            )}
          </div>
        ) : (
          <ParticipantAvatar participant={participants[0]} size={48} />
        )}

        <div className="min-w-0">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="text-xs font-medium text-primary">{metadata}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</p>

      <div className="mt-5 flex-1 space-y-2.5 rounded-xl bg-secondary/50 p-4">
        {previewMessages.map((message) => (
          <PreviewBubble key={message.id} message={message} showSender={isGroup} />
        ))}
      </div>
    </div>
  );
}

/**
 * @param {Object} props
 * @param {import("@/lib/landingContent").ConversationParticipant} props.participant
 * @param {number} props.size - pixel dimension for both the image and its wrapper
 * @param {boolean} [props.ringed] - card-colored ring so stacked avatars stay legible against each other
 */
function ParticipantAvatar({ participant, size, ringed = false }) {
  return (
    <div className={cn("relative shrink-0", ringed && "rounded-full ring-2 ring-card")} style={{ width: size, height: size }}>
      <Image
        src={participant.avatarUrl}
        alt={participant.name}
        fill
        sizes={`${size}px`}
        className="rounded-full object-cover"
      />
      {participant.isOnline && (
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
      )}
    </div>
  );
}

/**
 * @param {Object} props
 * @param {import("@/lib/landingContent").ConversationPreviewMessage} props.message
 * @param {boolean} props.showSender - group cards label incoming bubbles with who sent them, direct cards don't need to
 */
function PreviewBubble({ message, showSender }) {
  const isOwn = message.direction === "outgoing";

  return (
    <div className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}>
      {showSender && !isOwn && <span className="px-1 text-[11px] font-medium text-muted-foreground">{message.from}</span>}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
          isOwn
            ? "rounded-br-sm bg-bubble-own text-bubble-own-foreground"
            : "rounded-bl-sm bg-bubble-other text-bubble-other-foreground",
        )}
      >
        {message.text}
      </div>
      <span className="mt-0.5 px-1 text-[11px] text-muted-foreground">{message.time}</span>
    </div>
  );
}

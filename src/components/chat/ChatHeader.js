import { Avatar } from "@/components/shared/Avatar";

export function ChatHeader({ conversation, onBack, onOpenGroupInfo }) {
  const isGroup = conversation.type === "group";
  const displayName = isGroup ? conversation.name : conversation.participant.name;
  const subtitle = isGroup ? `${conversation.participants.length} members` : conversation.participant.phone;

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to conversations"
        className="-ml-1.5 rounded-lg p-1.5 text-foreground hover:bg-secondary md:hidden"
      >
        <BackIcon />
      </button>

      {isGroup ? (
        <button
          type="button"
          onClick={onOpenGroupInfo}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-lg py-1 text-left hover:bg-secondary/60"
        >
          <Avatar name={displayName} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </button>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Avatar name={displayName} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      )}
    </header>
  );
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

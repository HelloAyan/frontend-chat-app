export function NewMessagesPill({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-lg transition-transform hover:scale-105"
    >
      ↓ New messages
    </button>
  );
}

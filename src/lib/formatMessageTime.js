import { format, isToday, isYesterday } from "date-fns";

export function formatBubbleTime(date) {
  return format(new Date(date), "h:mm a");
}

// used in the conversation list, where space is tight so "Yesterday" beats
// a full date and a full date beats "3 days ago"
export function formatConversationTime(date) {
  const d = new Date(date);
  if (isToday(d)) return format(d, "h:mm a");
  if (isYesterday(d)) return "Yesterday";
  return format(d, "d MMM");
}

export function dateDividerLabel(date) {
  const d = new Date(date);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMMM d, yyyy");
}

export function isSameDay(a, b) {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

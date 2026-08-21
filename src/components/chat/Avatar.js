import { avatarColorFor, initialsFor } from "@/lib/avatarColor";
import { cn } from "@/lib/cn";

const SIZE_CLASSES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export function Avatar({ name, size = "md", className }) {
  const label = name || "?";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        SIZE_CLASSES[size],
        className,
      )}
      style={{ backgroundColor: avatarColorFor(label) }}
      aria-hidden="true"
    >
      {initialsFor(label)}
    </div>
  );
}

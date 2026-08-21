import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// merges conditional classNames and resolves conflicting Tailwind utilities
// (e.g. cn("px-2", condition && "px-4") should keep px-4, not both)
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

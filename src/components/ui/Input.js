import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef(function Input({ className, label, error, id, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          "rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground transition-colors",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          error && "border-destructive focus-visible:ring-destructive",
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
});

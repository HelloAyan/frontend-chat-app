import { Zap, Lock, Users, History } from "lucide-react";

// the mock data holds an icon name (string), not the component itself — see
// the note on FeatureItem in lib/landingContent.js for why. resolved here,
// the one place that actually needs the real component to render it.
const ICONS = { zap: Zap, lock: Lock, users: Users, history: History };

/**
 * @param {Object} props
 * @param {"zap"|"lock"|"users"|"history"} props.icon
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} [props.metadata]
 */
export function FeatureCard({ icon, title, description, metadata }) {
  const Icon = ICONS[icon];

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      {metadata && <p className="mt-4 text-xs font-medium text-primary">{metadata}</p>}
    </div>
  );
}

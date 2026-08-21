const PALETTE = [
  "oklch(0.7 0.15 25)", // red
  "oklch(0.72 0.15 70)", // amber
  "oklch(0.75 0.14 140)", // green
  "oklch(0.7 0.13 200)", // teal
  "oklch(0.65 0.18 264)", // blue
  "oklch(0.65 0.2 300)", // purple
  "oklch(0.7 0.18 340)", // pink
];

// picks a stable color per person so the same user always gets the same
// avatar color everywhere in the app, without needing the backend to store one
export function avatarColorFor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function initialsFor(name) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

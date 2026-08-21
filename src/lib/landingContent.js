// Landing-page copy lives here, separate from the components that render
// it, so the page can be re-worded or restructured without touching any
// component code. Every landing section reads its content from an object
// exported from this file.

export const heroContent = {
  eyebrow: "Real-time messaging",
  title: "Conversations that move in real time.",
  description:
    "Connect instantly with people and teams through fast, reliable messaging built for one-to-one and group conversations.",
  primaryCta: { label: "Start Chatting", href: "/login" },
  secondaryCta: { label: "Explore Features", href: "#features" },
  image: {
    src: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=1200&auto=format&fit=crop",
    alt: "A phone screen open to a folder of messaging apps",
  },
  previewMessages: [
    { from: "Rahim", text: "Are you free for a quick sync?", variant: "other" },
    { from: "You", text: "On it, give me 5 minutes 👍", variant: "own" },
  ],
};

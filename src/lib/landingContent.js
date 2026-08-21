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
    src: "/images/hero.jpg",
    alt: "A phone screen open to a folder of messaging apps",
  },
  previewMessages: [
    { from: "Rahim", text: "Are you free for a quick sync?", variant: "other" },
    { from: "You", text: "On it, give me 5 minutes 👍", variant: "own" },
  ],
};

/**
 * @typedef {Object} PreviewParticipant
 * @property {string} name
 * @property {boolean} isOnline
 * @property {boolean} [isGroup]
 */

/**
 * @typedef {Object} PreviewMessage
 * @property {string} id
 * @property {"incoming"|"outgoing"} direction - which side of the thread this bubble renders on
 * @property {string} text
 * @property {string} time - pre-formatted display time, e.g. "10:26 AM"
 */

/**
 * @typedef {Object} PreviewConversation
 * @property {string} id
 * @property {PreviewParticipant} participant
 * @property {string} lastMessage
 * @property {string} lastMessageTime - relative, e.g. "2m", "1h"
 * @property {boolean} isActive - which conversation the mock chat panel opens to
 * @property {PreviewMessage[]} messages - only populated for the active conversation
 */

/**
 * @typedef {Object} ChatPreviewContent
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} description
 * @property {PreviewConversation[]} conversations
 */

/** @type {ChatPreviewContent} */
export const chatPreviewContent = {
  eyebrow: "See it in action",
  title: "A chat panel built for real conversations.",
  description:
    "Every message, timestamp, and online status updates the moment it happens — this is the same panel you'll actually use.",
  conversations: [
    {
      id: "c1",
      participant: { name: "Nusrat Jahan", isOnline: true },
      lastMessage: "Sounds good, see you at 4!",
      lastMessageTime: "2m",
      isActive: true,
      messages: [
        { id: "m1", direction: "incoming", text: "Hey! Are we still on for the design review?", time: "10:24 AM" },
        { id: "m2", direction: "outgoing", text: "Yes, just wrapping up a few slides.", time: "10:26 AM" },
        { id: "m3", direction: "incoming", text: "No rush, take your time 🙂", time: "10:26 AM" },
        { id: "m4", direction: "outgoing", text: "Sounds good, see you at 4!", time: "10:29 AM" },
      ],
    },
    {
      id: "c2",
      participant: { name: "Rahim Ahmed", isOnline: false },
      lastMessage: "Pushed the fix, can you take a look?",
      lastMessageTime: "18m",
      isActive: false,
      messages: [],
    },
    {
      id: "c3",
      participant: { name: "Product Team", isOnline: true, isGroup: true },
      lastMessage: "Karim: Deploy is done ✅",
      lastMessageTime: "1h",
      isActive: false,
      messages: [],
    },
    {
      id: "c4",
      participant: { name: "Tania Islam", isOnline: false },
      lastMessage: "Thanks for the update!",
      lastMessageTime: "3h",
      isActive: false,
      messages: [],
    },
  ],
};

/**
 * @typedef {Object} FeatureItem
 * @property {string} id
 * @property {"zap"|"lock"|"users"|"history"} icon - resolved to a lucide-react
 *   component inside FeatureCard; a string here (not the component itself)
 *   because this data module gets imported by a server component and a raw
 *   component reference can't cross the server/client boundary as a prop
 * @property {string} title
 * @property {string} description
 * @property {string} [metadata] - short supporting stat/label shown under the description
 */

/**
 * @typedef {Object} FeatureSectionContent
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} description
 * @property {FeatureItem[]} features
 */

/** @type {FeatureSectionContent} */
export const featureSectionContent = {
  eyebrow: "Key features",
  title: "Everything a real conversation needs.",
  description: "Built around the parts of messaging that actually matter — speed, privacy, and never losing a thread.",
  features: [
    {
      id: "realtime",
      icon: "zap",
      title: "Real-time messaging",
      description:
        "Messages arrive the instant they're sent, no refreshing, no delay. Every conversation stays live through a persistent connection, not a polling loop.",
      metadata: "Instant delivery",
    },
    {
      id: "private",
      icon: "lock",
      title: "Private conversations",
      description:
        "Start a one-to-one chat with anyone in seconds. Every conversation is scoped to just the two people in it, nothing more, nothing shared.",
      metadata: "Just between you two",
    },
    {
      id: "group",
      icon: "users",
      title: "Group conversations",
      description:
        "Bring your whole team into one thread. Admins manage who joins, who leaves, and who else gets to run the group.",
      metadata: "Built-in admin controls",
    },
    {
      id: "history",
      icon: "history",
      title: "Conversation history",
      description:
        "Nothing disappears. Scroll back as far as you need, older messages load in seamlessly right where you left off.",
      metadata: "Loads as you scroll",
    },
  ],
};

/**
 * @typedef {Object} ShowcaseMessage
 * @property {string} id
 * @property {"incoming"|"outgoing"} direction
 * @property {string} text
 * @property {string} time
 */

/**
 * @typedef {Object} RealtimeShowcaseContent
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} description
 * @property {{name: string, isOnline: boolean}} participant
 * @property {ShowcaseMessage[]} baseMessages - visible immediately, before the animated sequence runs
 * @property {ShowcaseMessage} incomingMessage - "arrives" after the typing indicator, once, on mount
 */

/** @type {RealtimeShowcaseContent} */
export const realtimeShowcaseContent = {
  eyebrow: "Real-time, not just refreshed",
  title: "Watch a message arrive, live.",
  description: "No refresh button, no polling delay — new messages land the instant they're sent, typing indicator and all.",
  participant: { name: "Karim Hasan", isOnline: true },
  baseMessages: [
    { id: "s1", direction: "incoming", text: "Did you get a chance to review the PR?", time: "11:02 AM" },
    { id: "s2", direction: "outgoing", text: "Just about to, give me two minutes.", time: "11:03 AM" },
  ],
  incomingMessage: {
    id: "s3",
    direction: "incoming",
    text: "No rush, thanks for the quick turnaround 🙌",
    time: "11:06 AM",
  },
};

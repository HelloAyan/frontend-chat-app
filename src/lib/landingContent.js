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
 * @typedef {Object} ConversationParticipant
 * @property {string} id
 * @property {string} name
 * @property {string} avatarUrl - live/remote avatar image URL
 * @property {boolean} [isOnline]
 */

/**
 * @typedef {Object} ConversationPreviewMessage
 * @property {string} id
 * @property {string} from - sender display name, used for group previews where the speaker isn't implied by side alone
 * @property {"incoming"|"outgoing"} direction
 * @property {string} text
 * @property {string} time - pre-formatted display time, e.g. "9:42 AM"
 */

/**
 * @typedef {Object} ConversationTypeCard
 * @property {string} id
 * @property {"direct"|"group"} type
 * @property {string} title
 * @property {string} description
 * @property {string} metadata - short supporting label, e.g. "Just between you two" or "6 members"
 * @property {ConversationParticipant[]} participants - avatars shown on the card (the other person for "direct", a handful of members for "group")
 * @property {number} [totalParticipantCount] - "group" only; drives the "+N" overflow chip when there are more members than shown avatars
 * @property {ConversationPreviewMessage[]} previewMessages
 */

/**
 * @typedef {Object} ConversationTypesContent
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} description
 * @property {ConversationTypeCard[]} cards
 */

/** @type {ConversationTypesContent} */
export const conversationTypesContent = {
  eyebrow: "Two ways to connect",
  title: "Conversations that fit how you talk.",
  description: "Whether it's just the two of you or the whole team, every conversation gets the same real-time experience.",
  cards: [
    {
      id: "direct",
      type: "direct",
      title: "Private conversations",
      description: "Keep one-to-one conversations focused and personal.",
      metadata: "Just between you two",
      participants: [
        { id: "u1", name: "Nusrat Jahan", avatarUrl: "https://i.pravatar.cc/150?img=47", isOnline: true },
      ],
      previewMessages: [
        { id: "pm1", from: "Nusrat Jahan", direction: "incoming", text: "Are you around for a quick call?", time: "9:41 AM" },
        { id: "pm2", from: "You", direction: "outgoing", text: "Yep, calling you now.", time: "9:42 AM" },
      ],
    },
    {
      id: "group",
      type: "group",
      title: "Built for group conversations",
      description: "Bring your team together in one shared conversation.",
      metadata: "6 members",
      totalParticipantCount: 6,
      participants: [
        { id: "u2", name: "Karim Hasan", avatarUrl: "https://i.pravatar.cc/150?img=12", isOnline: true },
        { id: "u3", name: "Tania Islam", avatarUrl: "https://i.pravatar.cc/150?img=32", isOnline: false },
        { id: "u4", name: "Rahim Ahmed", avatarUrl: "https://i.pravatar.cc/150?img=15", isOnline: true },
        { id: "u5", name: "Farah Chowdhury", avatarUrl: "https://i.pravatar.cc/150?img=25", isOnline: false },
      ],
      previewMessages: [
        { id: "pm3", from: "Karim Hasan", direction: "incoming", text: "Deploy is done ✅", time: "2:14 PM" },
        { id: "pm4", from: "Tania Islam", direction: "incoming", text: "Nice, checking the staging link now.", time: "2:15 PM" },
        { id: "pm5", from: "You", direction: "outgoing", text: "Great work, team 🎉", time: "2:16 PM" },
      ],
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

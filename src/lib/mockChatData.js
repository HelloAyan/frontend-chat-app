// Placeholder data so the chat UI can be built and reviewed before the real
// API/socket layer is wired in. Every shape here matches docs/openapi.yaml,
// so swapping this out for redux + real requests later shouldn't require
// touching anything under src/components/chat.

function minutesAgo(n) {
  return new Date(Date.now() - n * 60_000).toISOString();
}
function hoursAgo(n) {
  return new Date(Date.now() - n * 60 * 60_000).toISOString();
}
function daysAgo(n) {
  return new Date(Date.now() - n * 24 * 60 * 60_000).toISOString();
}

export const CURRENT_USER = { _id: "me", name: "Ayan Ahmed", phone: "+8801711000000" };

export const MOCK_USERS = [
  { _id: "u1", name: "Rahim Ahmed", phone: "+8801711111111" },
  { _id: "u2", name: "Karim Hasan", phone: "+8801722222222" },
  { _id: "u3", name: "Nusrat Jahan", phone: "+8801733333333" },
  { _id: "u4", name: "Tania Islam", phone: "+8801744444444" },
];

const [rahim, karim, nusrat] = MOCK_USERS;

export const MOCK_CONVERSATIONS = [
  {
    _id: "c1",
    type: "direct",
    participant: rahim,
    lastMessage: { text: "Let's discuss the task", sender: rahim._id, createdAt: minutesAgo(6) },
    updatedAt: minutesAgo(6),
  },
  {
    _id: "c2",
    type: "direct",
    participant: karim,
    lastMessage: { text: "Sounds good, see you then", sender: "me", createdAt: hoursAgo(3) },
    updatedAt: hoursAgo(3),
  },
  {
    _id: "c3",
    type: "group",
    name: "Dev Team",
    createdBy: "me",
    admins: ["me"],
    participants: [CURRENT_USER, karim, nusrat],
    lastMessage: { text: "Deploy is done ✅", sender: karim._id, createdAt: daysAgo(1) },
    updatedAt: daysAgo(1),
  },
];

export const MOCK_MESSAGES = {
  c1: [
    { _id: "m1", conversation: "c1", sender: rahim._id, text: "Hey, are you free today?", createdAt: daysAgo(1) },
    { _id: "m2", conversation: "c1", sender: "me", text: "Yeah, free after 3", createdAt: daysAgo(1) },
    { _id: "m3", conversation: "c1", sender: rahim._id, text: "Perfect, let's sync then", createdAt: hoursAgo(20) },
    { _id: "m4", conversation: "c1", sender: rahim._id, text: "I'll share the doc before that", createdAt: hoursAgo(20) },
    { _id: "m5", conversation: "c1", sender: "me", text: "Sounds good 👍", createdAt: minutesAgo(10) },
    { _id: "m6", conversation: "c1", sender: rahim._id, text: "Let's discuss the task", createdAt: minutesAgo(6) },
  ],
  c2: [
    { _id: "m7", conversation: "c2", sender: karim._id, text: "Are you around for a quick call?", createdAt: hoursAgo(5) },
    { _id: "m8", conversation: "c2", sender: "me", text: "Sure, give me 5 minutes", createdAt: hoursAgo(4) },
    { _id: "m9", conversation: "c2", sender: "me", text: "Sounds good, see you then", createdAt: hoursAgo(3) },
  ],
  c3: [
    { _id: "m10", conversation: "c3", sender: nusrat._id, text: "Pushed the migration script", createdAt: daysAgo(2) },
    { _id: "m11", conversation: "c3", sender: "me", text: "Nice, running it on staging now", createdAt: daysAgo(1) },
    { _id: "m12", conversation: "c3", sender: karim._id, text: "Staging looks clean", createdAt: daysAgo(1) },
    { _id: "m13", conversation: "c3", sender: karim._id, text: "Deploy is done ✅", createdAt: daysAgo(1) },
  ],
};

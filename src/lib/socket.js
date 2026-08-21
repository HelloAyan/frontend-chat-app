import { io } from "socket.io-client";

// Socket.IO lives at the host root, not the /api base every REST call in
// api-client.js uses — the server mounts it separately (see docs/openapi.yaml).
const SOCKET_URL = "https://frontend-task-chatapp.onrender.com";

export function createSocket(token) {
  return io(SOCKET_URL, { auth: { token } });
}

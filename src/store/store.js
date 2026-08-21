import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/features/auth/api";
import { conversationsApi } from "@/features/conversations/api";
import { usersApi } from "@/features/users/api";
import { messagesApi } from "@/features/messages/api";

// RTK Query slices go in here alongside any plain client-state slices
// (there aren't any of the latter yet, e.g. active conversation selection
// will land here once that's worth lifting out of chat/page.js).
export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [conversationsApi.reducerPath]: conversationsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      conversationsApi.middleware,
      usersApi.middleware,
      messagesApi.middleware,
    ),
});

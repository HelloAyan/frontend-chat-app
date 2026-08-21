import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/features/auth/api";

// RTK Query slices go in here alongside any plain client-state slices
// (there aren't any of the latter yet, e.g. active conversation selection
// will land here once chat is wired to the real API).
export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
});

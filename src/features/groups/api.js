import { createApi } from "@reduxjs/toolkit/query/react";
import { rtkBaseQuery } from "@/lib/api-client";

export const groupsApi = createApi({
  reducerPath: "groupsApi",
  baseQuery: rtkBaseQuery,
  endpoints: (builder) => ({
    // returns the full Conversation shape already (unlike POST
    // /conversations, no follow-up fetch needed to fill anything in)
    createGroup: builder.mutation({
      query: (body) => ({ url: "/conversations/group", method: "POST", body }),
    }),
    // admin-only server-side (403 if the caller isn't one). also returns the
    // full, updated Conversation.
    addParticipants: builder.mutation({
      query: ({ conversationId, userIds }) => ({
        url: `/conversations/${conversationId}/participants`,
        method: "POST",
        body: { userIds },
      }),
    }),
    // removing someone else needs admin (403 otherwise, verified live);
    // passing your own id always works, that's how leaving a group works.
    // returns the full, updated Conversation either way.
    removeParticipant: builder.mutation({
      query: ({ conversationId, userId }) => ({
        url: `/conversations/${conversationId}/participants/${userId}`,
        method: "DELETE",
      }),
    }),
    // admin-only (403 otherwise, verified live). promoting someone who's
    // already an admin is a harmless no-op, not an error.
    promoteAdmin: builder.mutation({
      query: ({ conversationId, userId }) => ({
        url: `/conversations/${conversationId}/admins`,
        method: "POST",
        body: { userId },
      }),
    }),
    // admin-only (403 otherwise). trying this on a direct conversation gets
    // a 400 NOT_A_GROUP, though the UI only ever offers renaming for groups
    // in the first place.
    renameGroup: builder.mutation({
      query: ({ conversationId, name }) => ({
        url: `/conversations/${conversationId}`,
        method: "PATCH",
        body: { name },
      }),
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useAddParticipantsMutation,
  useRemoveParticipantMutation,
  usePromoteAdminMutation,
  useRenameGroupMutation,
} = groupsApi;

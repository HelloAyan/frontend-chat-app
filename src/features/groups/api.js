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
  }),
});

export const { useCreateGroupMutation, useAddParticipantsMutation } = groupsApi;

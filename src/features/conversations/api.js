import { createApi } from "@reduxjs/toolkit/query/react";
import { rtkBaseQuery } from "@/lib/api-client";

export const conversationsApi = createApi({
  reducerPath: "conversationsApi",
  baseQuery: rtkBaseQuery,
  tagTypes: ["Conversation"],
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => ({ url: "/conversations" }),
      // the API wraps the list as { data: [...] }, callers just want the array
      transformResponse: (response) => response.data,
      providesTags: ["Conversation"],
    }),
    // returns the new conversation, or the existing one if these two users
    // already have one (see docs/openapi.yaml). either way the response is
    // the slim { _id, participants, createdAt } shape, not a full
    // Conversation, so the caller refetches the list to get the real one
    startConversation: builder.mutation({
      query: (userId) => ({ url: "/conversations", method: "POST", body: { userId } }),
      invalidatesTags: ["Conversation"],
    }),
  }),
});

export const { useGetConversationsQuery, useStartConversationMutation } = conversationsApi;

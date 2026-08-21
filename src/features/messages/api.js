import { createApi } from "@reduxjs/toolkit/query/react";
import { rtkBaseQuery } from "@/lib/api-client";

const PAGE_SIZE = 20;

export const messagesApi = createApi({
  reducerPath: "messagesApi",
  baseQuery: rtkBaseQuery,
  tagTypes: ["Message"],
  endpoints: (builder) => ({
    // "next page" here means the next page of history, i.e. older messages
    // further up. the first page (no pageParam) has no `before` cursor and
    // comes back newest-first, same as the API itself returns it.
    getMessages: builder.infiniteQuery({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.messages.at(-1)?._id : undefined),
      },
      query: ({ queryArg: conversationId, pageParam }) => ({
        url: `/conversations/${conversationId}/messages`,
        params: { limit: PAGE_SIZE, before: pageParam },
      }),
      providesTags: (result, error, conversationId) => [{ type: "Message", id: conversationId }],
    }),
    // no invalidatesTags here on purpose: refreshing the whole infinite
    // query on every send would refetch every page already loaded and
    // fight with the scroll-position logic in MessageList. the sent
    // message (which this returns in full, real id included) gets merged
    // into the view locally instead, see chat/page.js.
    sendMessage: builder.mutation({
      query: ({ conversationId, text }) => ({ url: "/messages", method: "POST", body: { conversationId, text } }),
    }),
  }),
});

export const { useGetMessagesInfiniteQuery, useSendMessageMutation } = messagesApi;

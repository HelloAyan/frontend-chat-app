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
  }),
});

export const { useGetMessagesInfiniteQuery } = messagesApi;

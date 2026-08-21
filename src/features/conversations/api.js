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
  }),
});

export const { useGetConversationsQuery } = conversationsApi;

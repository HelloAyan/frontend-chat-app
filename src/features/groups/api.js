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
  }),
});

export const { useCreateGroupMutation } = groupsApi;

import { createApi } from "@reduxjs/toolkit/query/react";
import { rtkBaseQuery } from "@/lib/api-client";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: rtkBaseQuery,
  endpoints: (builder) => ({
    searchUsers: builder.query({
      query: (q) => ({ url: "/users/search", params: { q } }),
    }),
  }),
});

export const { useSearchUsersQuery } = usersApi;

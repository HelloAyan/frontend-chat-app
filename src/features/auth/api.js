import { createApi } from "@reduxjs/toolkit/query/react";
import { rtkBaseQuery } from "@/lib/api-client";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: rtkBaseQuery,
  tagTypes: ["CurrentUser"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      invalidatesTags: ["CurrentUser"],
    }),
    getCurrentUser: builder.query({
      query: () => ({ url: "/auth/me" }),
      providesTags: ["CurrentUser"],
    }),
  }),
});

export const { useLoginMutation, useGetCurrentUserQuery } = authApi;

import { createApi } from "@reduxjs/toolkit/query/react";
import { rtkBaseQuery } from "@/lib/api-client";

// the backend builds a regex straight from this query (confirmed live: a
// leading "+" — i.e. any correctly-formatted phone number — makes the whole
// request 500 with "quantifier does not follow a repeatable item"). every
// caller goes through this one endpoint, so stripping regex metacharacters
// here covers all of them instead of relying on each search box to remember.
const REGEX_SPECIAL_CHARS = /[\\^$.|?*+()[\]{}]/g;

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: rtkBaseQuery,
  endpoints: (builder) => ({
    searchUsers: builder.query({
      query: (q) => ({ url: "/users/search", params: { q: q.replace(REGEX_SPECIAL_CHARS, "") } }),
    }),
  }),
});

export const { useSearchUsersQuery } = usersApi;

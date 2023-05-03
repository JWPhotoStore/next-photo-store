import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OrderType } from "@/types/OrderType";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    // NOTE: you get builder query directly in arguments for endpoints function
    // TODO: Add proper typing to query
    getActiveOrder: builder.query<OrderType, void>({
      query: () => "api/fetch-active-order",
    }),
  }),
});

export const { useGetActiveOrderQuery } = api;

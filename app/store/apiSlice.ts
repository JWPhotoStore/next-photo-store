import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartItemsApi = createApi({
  reducerPath: "cartItemsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
  endpoints: (builder) => ({
    // NOTE: you get builder query directly in arguments for endpoints function
    // TODO: Add proper typing to query
    getAllCartItems: builder.query<any, void>({
      query: () => "api/fetch-payment-intent",
    }),
  }),
});

export const { useGetAllCartItemsQuery } = cartItemsApi;

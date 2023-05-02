import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartItemsApi = createApi({
  reducerPath: "cartItemsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
  endpoints: (builder) => ({
    // NOTE: you get builder query directly in arguments for endpoints function
    getAllCartItems: builder.query<any, void>({
      query: () => "api/fetch-payment-intent",
    }),
  }),
  // reducerPath: "cartItemsApi",
  // baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
  // endpoints: (builder) => ({
  //   getAllCartItems: builder.query({
  //     query: (name) => `pokemon/${name}`,
  //   }),
  // }),
});

export const { useGetAllCartItemsQuery } = cartItemsApi;

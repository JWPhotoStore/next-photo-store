import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OrderType } from "@/types/OrderType";
import { CartItemType } from "@/types/CartItemType";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  refetchOnMountOrArgChange: true,
  //TODO: Tags weren't needed to re-render as expected (after implementing refetchOnMountOrArgChange).
  // Check again to understand what they do.
  // tagTypes: ["CartItems"],
  endpoints: (builder) => ({
    // NOTE: you get builder query directly in arguments for endpoints function
    // TODO: Add proper typing to query
    getActiveOrder: builder.query<OrderType, void>({
      query: () => "api/fetch-active-order",
    }),
    getCartItems: builder.query<CartItemType[], void>({
      query: () => "api/fetch-active-order",
      transformResponse: (res: any) => {
        return res.cartItems;
      },
      // providesTags: ["CartItems"],
    }),
    deleteCartItem: builder.mutation({
      query: (name: string) => ({
        url: "api/mutate-cart-item",
        method: "DELETE",
        body: name,
      }),
      // invalidatesTags: ["CartItems"],
    }),
  }),
});

export const {
  useGetActiveOrderQuery,
  useDeleteCartItemMutation,
  useGetCartItemsQuery,
} = api;

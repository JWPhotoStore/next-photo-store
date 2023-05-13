import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OrderType } from "@/types/OrderType";
import { ClientSecretType } from "@/types/ClientSecretType";
import { CartItemType, CartItemBareType } from "@/types/CartItemType";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  refetchOnMountOrArgChange: true,
  //TODO: Tags weren't needed to re-render as expected (after implementing refetchOnMountOrArgChange).
  // Check again to understand what they do.
  tagTypes: ["CartItems", "ClientSecret"],
  endpoints: (builder) => ({
    // NOTE: you get builder query directly in arguments for endpoints function
    // TODO: Add proper typing to query
    getActiveOrder: builder.query<OrderType, void>({
      query: () => "api/fetch-active-order",
      providesTags: ["CartItems"],
    }),
    addCartItem: builder.mutation({
      query: (body) => ({
        url: "api/add-to-cart",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CartItems", "ClientSecret"],
    }),
    deleteCartItem: builder.mutation({
      query: (cartItemName: string) => ({
        url: `api/mutate-cart-item/${cartItemName}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CartItems", "ClientSecret"],
    }),
    updateCartItem: builder.mutation({
      query: ({ name, quantity, unit_amount }: CartItemBareType) => ({
        url: "api/mutate-cart-item",
        method: "PATCH",
        body: { name, unit_amount, quantity },
      }),
      invalidatesTags: ["CartItems", "ClientSecret"],
    }),
    getClientSecret: builder.query<ClientSecretType, void>({
      query: () => "api/stripe-secret",
      providesTags: ["ClientSecret"],
    }),
  }),
});

export const {
  useGetActiveOrderQuery,
  useAddCartItemMutation,
  useDeleteCartItemMutation,
  useUpdateCartItemMutation,
  useGetClientSecretQuery,
} = api;

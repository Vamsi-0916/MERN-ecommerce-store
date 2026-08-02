import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["Order"],
    }),

    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      providesTags: ["Order"],
    }),

    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
      invalidatesTags: ["Order"],
    }),

    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
    }),

    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Order"],
    }),

    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      providesTags: ["Order"],
    }),

    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
      invalidatesTags: ["Order"],
    }),

    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),

    getTotalOrders: builder.query({
      query: () => `${ORDERS_URL}/total-orders`,
      providesTags: ["Order"],
    }),

    getTotalSales: builder.query({
      query: () => `${ORDERS_URL}/total-sales`,
      providesTags: ["Order"],
    }),

    getTotalSalesByDate: builder.query({
      query: () => `${ORDERS_URL}/total-sales-by-date`,
      providesTags: ["Order"],
    }),
  }),
});

export const {
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
  // ------------------
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useDeliverOrderMutation,
  useDeleteOrderMutation,
  useGetOrdersQuery,
} = orderApiSlice;

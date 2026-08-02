import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetOrdersQuery,
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useMemo } from "react";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading: loadingSales } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loadingCustomers } = useGetUsersQuery();
  const { data: orders, isLoading: loadingOrders } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();
  const { data: orderList, isLoading: loadingOrderList } = useGetOrdersQuery();

  const totalSales = sales?.totalSales || 0;
  const totalCustomers = customers?.length || 0;
  const totalOrders = orders?.totalOrders || 0;
  const averageOrderValue = totalOrders ? totalSales / totalOrders : 0;

  const chartCategories = useMemo(
    () => salesDetail?.map((item) => item._id) || [],
    [salesDetail]
  );

  const chartSeries = useMemo(
    () => [
      {
        name: "Sales",
        data: salesDetail?.map((item) => Number(item.totalSales || 0)) || [],
      },
    ],
    [salesDetail]
  );

  const chartOptions = useMemo(
    () => ({
      chart: {
        type: "area",
        toolbar: { show: false },
        zoom: { enabled: false },
        foreColor: "#64748b",
      },
      colors: ["#3b82f6"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.28,
          opacityTo: 0.04,
          stops: [0, 95, 100],
        },
      },
      grid: {
        borderColor: "#e5e7eb",
        strokeDashArray: 4,
        padding: {
          left: 12,
          right: 18,
        },
      },
      markers: {
        size: 4,
        strokeWidth: 0,
        hover: {
          size: 6,
        },
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: (value) => `$${Number(value).toFixed(2)}`,
        },
      },
      xaxis: {
        categories: chartCategories,
        labels: {
          style: {
            colors: "#64748b",
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        min: 0,
        labels: {
          formatter: (value) => `$${Number(value).toFixed(0)}`,
          style: {
            colors: "#64748b",
          },
        },
      },
      legend: {
        show: false,
      },
    }),
    [chartCategories]
  );

  const summaryCards = [
    {
      label: "Sales",
      value: loadingSales ? null : `$${totalSales.toFixed(2)}`,
    },
    {
      label: "Customers",
      value: loadingCustomers ? null : totalCustomers,
    },
    {
      label: "All Orders",
      value: loadingOrders ? null : totalOrders,
    },
  ];

  const bottomStats = [
    {
      label: "Average Order",
      value: `$${averageOrderValue.toFixed(2)}`,
    },
    {
      label: "Paid Sales",
      value: `$${totalSales.toFixed(2)}`,
    },
    {
      label: "Customers",
      value: totalCustomers,
    },
    {
      label: "Orders",
      value: totalOrders,
    },
  ];

  const latestOrders = useMemo(
    () =>
      [...(orderList || [])]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10),
    [orderList]
  );

  return (
    <>
      <AdminMenu />

      <section className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 md:px-8 xl:ml-[4rem]">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-6">
            <p className="text-sm font-medium text-blue-600">Admin Overview</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950">
              Sales Summary
            </h1>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {summaryCards.map((card) => (
              <div
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                key={card.label}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg font-bold text-blue-600">
                  $
                </div>
                <p className="text-sm font-medium text-slate-500">
                  {card.label}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">
                  {card.value === null ? <Loader /> : card.value}
                </h2>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Latest Sales
                  </p>
                  <h2 className="mt-5 text-4xl font-bold text-slate-950">
                    ${totalSales.toFixed(2)}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Total paid sales
                  </p>
                </div>

                <div className="mt-6 rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white">
                  Single Sales Trend
                </div>
              </div>

              <div className="h-[320px] min-w-0">
                <Chart
                  options={chartOptions}
                  series={chartSeries}
                  type="area"
                  height="100%"
                  width="100%"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {bottomStats.map((stat) => (
              <div
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                key={stat.label}
              >
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-xl font-bold text-slate-950">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Last 10 Orders
                </h2>
                <p className="text-sm text-slate-500">
                  Recent order activity
                </p>
              </div>
            </div>

            {loadingOrderList ? (
              <Loader />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                      <th className="py-3 pr-4 font-semibold">Order</th>
                      <th className="py-3 pr-4 font-semibold">Customer</th>
                      <th className="py-3 pr-4 font-semibold">Date</th>
                      <th className="py-3 pr-4 font-semibold">Total</th>
                      <th className="py-3 pr-4 font-semibold">Payment</th>
                      <th className="py-3 pr-4 font-semibold">Delivery</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestOrders.map((order) => (
                      <tr
                        className="border-b border-slate-100 last:border-0"
                        key={order._id}
                      >
                        <td className="py-3 pr-4 font-medium text-slate-950">
                          {order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="py-3 pr-4 text-slate-600">
                          {order.user?.username || "N/A"}
                        </td>
                        <td className="py-3 pr-4 text-slate-600">
                          {order.createdAt?.substring(0, 10) || "N/A"}
                        </td>
                        <td className="py-3 pr-4 font-semibold text-slate-950">
                          ${Number(order.totalPrice || 0).toFixed(2)}
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              order.isPaid
                                ? "bg-emerald-50 text-emerald-700"
                                : order.paymentMethod === "Cash on Delivery"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            {order.isPaid
                              ? "Paid"
                              : order.paymentMethod === "Cash on Delivery"
                              ? "Cash on Delivery"
                              : "Pending"}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              order.isDelivered
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {order.isDelivered ? "Delivered" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;

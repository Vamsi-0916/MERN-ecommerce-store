import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useDeleteOrderMutation,
  useGetMyOrdersQuery,
} from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error, refetch } = useGetMyOrdersQuery();
  const [deleteOrder, { isLoading: loadingDelete }] =
    useDeleteOrderMutation();

  const deleteHandler = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(orderId).unwrap();
        toast.success("Order deleted");
        refetch();
      } catch (error) {
        toast.error(error?.data?.error || error?.data?.message || error.error);
      }
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Orders </h2>
      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <td className="py-2">IMAGE</td>
              <td className="py-2">ID</td>
              <td className="py-2">DATE</td>
              <td className="py-2">TOTAL</td>
              <td className="py-2">PAID</td>
              <td className="py-2">DELIVERED</td>
              <td className="py-2"></td>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <img
                  src={order.orderItems[0].image}
                  alt={order.user}
                  className="w-[6rem] mb-5"
                />

                <td className="py-2">{order._id}</td>
                <td className="py-2">{order.createdAt.substring(0, 10)}</td>
                <td className="py-2">$ {order.totalPrice}</td>

                <td className="py-2">
                  {order.isPaid ? (
                    <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">
                      Completed
                    </p>
                  ) : order.paymentMethod === "Cash on Delivery" ? (
                    <p className="p-1 text-center bg-yellow-400 text-black w-[9rem] rounded-full">
                      Cash on Delivery
                    </p>
                  ) : (
                    <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">
                      Pending
                    </p>
                  )}
                </td>

                <td className="px-2 py-2">
                  {order.isDelivered ? (
                    <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">
                      Completed
                    </p>
                  ) : (
                    <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">
                      Pending
                    </p>
                  )}
                </td>

                <td className="px-2 py-2">
                  <div className="flex gap-2">
                    <Link to={`/order/${order._id}`}>
                      <button className="bg-pink-400 text-back py-2 px-3 rounded">
                        View Details
                      </button>
                    </Link>
                    {!order.isDelivered && (
                      <button
                        className="bg-red-600 text-white py-2 px-3 rounded"
                        onClick={() => deleteHandler(order._id)}
                        type="button"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserOrder;

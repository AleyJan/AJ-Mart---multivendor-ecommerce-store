import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { server } from "../../server";

const statuses = ["Processing", "Shipping", "Delivered"];

const AllOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch, seller]);

  const updateStatus = async (id, status) => {
    await axios
      .put(
        `${server}/order/update-order-status/${id}`,
        { status },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("Order status updated!");
        dispatch(getAllOrdersOfShop(seller._id));
      })
      .catch((e) => toast.error(e.response?.data?.message || "Update failed"));
  };

  return (
    <div className="w-full p-4 800px:p-8">
      <h3 className="text-[22px] font-Poppins pb-4 font-[500]">All Orders</h3>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : orders && orders.length ? (
        <div className="overflow-x-auto bg-white rounded shadow-sm p-3">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b text-[14px] text-gray-500">
                <th className="py-2 pr-4">Order ID</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Items Qty</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const qty = o.cart.reduce((a, i) => a + i.qty, 0);
                return (
                  <tr key={o._id} className="border-b text-[14px]">
                    <td className="py-3 pr-4">{o._id.slice(-8)}</td>
                    <td
                      className={`py-3 pr-4 ${
                        o.status === "Delivered"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {o.status}
                    </td>
                    <td className="py-3 pr-4">{qty}</td>
                    <td className="py-3 pr-4">US${o.totalPrice}</td>
                    <td className="py-3 pr-4">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                        className="border rounded h-[32px] px-2"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center min-h-[40vh] text-gray-500">
          No orders yet.
        </div>
      )}
    </div>
  );
};

export default AllOrders;

import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../server";

const AdminAllOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get(`${server}/order/admin-all-orders`, { withCredentials: true })
      .then((r) => setOrders(r.data.orders || []))
      .catch(() => {});
  }, []);

  return (
    <div className="w-full p-4 800px:p-8">
      <h3 className="text-[22px] font-Poppins pb-4 font-[500]">All Orders</h3>
      <div className="overflow-x-auto bg-white rounded shadow-sm p-3">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b text-[14px] text-gray-500">
              <th className="py-2 pr-4">Order ID</th>
              <th className="py-2 pr-4">Buyer</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Items Qty</th>
              <th className="py-2 pr-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b text-[14px]">
                <td className="py-3 pr-4">{o._id.slice(-8)}</td>
                <td className="py-3 pr-4">{o.user?.name || "-"}</td>
                <td
                  className={`py-3 pr-4 ${
                    o.status === "Delivered"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {o.status}
                </td>
                <td className="py-3 pr-4">
                  {o.cart.reduce((a, i) => a + i.qty, 0)}
                </td>
                <td className="py-3 pr-4">US${o.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAllOrders;

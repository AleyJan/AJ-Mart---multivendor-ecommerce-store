import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear, MdStore } from "react-icons/md";
import { server } from "../../server";

const StatCard = ({ Icon, title, value, link, linkText }) => (
  <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
    <div className="flex items-center">
      <Icon size={30} className="mr-2" fill="#00000085" />
      <h3 className="text-[16px] leading-5 font-[400] text-[#00000085]">
        {title}
      </h3>
    </div>
    <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{value}</h5>
    {link ? (
      <Link to={link}>
        <h5 className="pt-4 pl-2 text-[#077f9c]">{linkText}</h5>
      </Link>
    ) : null}
  </div>
);

const AdminDashboardMain = () => {
  const [orders, setOrders] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${server}/order/admin-all-orders`, { withCredentials: true })
      .then((r) => setOrders(r.data.orders || []))
      .catch(() => {});
    axios
      .get(`${server}/shop/admin-all-sellers`, { withCredentials: true })
      .then((r) => setSellers(r.data.sellers || []))
      .catch(() => {});
    axios
      .get(`${server}/product/admin-all-products`, { withCredentials: true })
      .then((r) => setProducts(r.data.products || []))
      .catch(() => {});
  }, []);

  const totalRevenue = orders.reduce((a, o) => a + o.totalPrice, 0);
  const adminEarning = totalRevenue * 0.1; // 10% platform commission

  return (
    <div className="w-full p-4 800px:p-8">
      <h3 className="text-[22px] font-Poppins pb-2 font-[500]">Admin Overview</h3>
      <div className="w-full block 800px:flex items-center justify-between">
        <StatCard
          Icon={AiOutlineMoneyCollect}
          title="Total Earning (10% commission)"
          value={`$${adminEarning.toFixed(2)}`}
        />
        <StatCard
          Icon={MdStore}
          title="All Sellers"
          value={sellers.length}
          link="/admin-sellers"
          linkText="View Sellers"
        />
        <StatCard
          Icon={MdBorderClear}
          title="All Orders"
          value={orders.length}
          link="/admin-orders"
          linkText="View Orders"
        />
      </div>

      <p className="text-[14px] text-gray-500 mt-2">
        Total products on the platform: <b>{products.length}</b>
      </p>

      <h3 className="text-[22px] font-Poppins pb-2 mt-8 font-[500]">
        Latest Orders
      </h3>
      <div className="overflow-x-auto bg-white rounded shadow-sm p-3">
        {orders.length ? (
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="border-b text-[14px] text-gray-500">
                <th className="py-2 pr-4">Order ID</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Items Qty</th>
                <th className="py-2 pr-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map((o) => (
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
                  <td className="py-3 pr-4">
                    {o.cart.reduce((a, i) => a + i.qty, 0)}
                  </td>
                  <td className="py-3 pr-4">US${o.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 py-4">No orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardMain;

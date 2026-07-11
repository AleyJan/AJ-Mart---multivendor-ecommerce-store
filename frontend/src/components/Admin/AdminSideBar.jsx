import { Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FiShoppingBag, FiUsers, FiPackage } from "react-icons/fi";
import { MdStore, MdOutlinePayment } from "react-icons/md";

const items = [
  { id: 1, title: "Dashboard", url: "/admin/dashboard", Icon: RxDashboard },
  { id: 2, title: "All Orders", url: "/admin-orders", Icon: FiShoppingBag },
  { id: 3, title: "All Sellers", url: "/admin-sellers", Icon: MdStore },
  { id: 4, title: "All Users", url: "/admin-users", Icon: FiUsers },
  { id: 5, title: "All Products", url: "/admin-products", Icon: FiPackage },
  {
    id: 6,
    title: "Withdraw Requests",
    url: "/admin-withdraw-request",
    Icon: MdOutlinePayment,
  },
];

const AdminSideBar = ({ active }) => {
  return (
    <div className="w-full h-[90vh] bg-white shadow-sm overflow-y-scroll sticky top-0 left-0 z-10">
      {items.map(({ id, title, url, Icon }) => (
        <div className="w-full flex items-center p-4" key={id}>
          <Link to={url} className="w-full flex items-center">
            <Icon size={28} color={active === id ? "crimson" : "#555"} />
            <h5
              className={`hidden 800px:block pl-2 text-[16px] font-[400] ${
                active === id ? "text-[crimson]" : "text-[#555]"
              }`}
            >
              {title}
            </h5>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default AdminSideBar;

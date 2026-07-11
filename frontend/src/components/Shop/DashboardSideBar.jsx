import { Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FiShoppingBag, FiPackage, FiPlusSquare } from "react-icons/fi";
import { MdOutlineLocalOffer, MdOutlinePayment } from "react-icons/md";
import { AiOutlinePlusCircle, AiOutlineGift, AiOutlineSetting } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";

const items = [
  { id: 1, title: "Dashboard", url: "/dashboard", Icon: RxDashboard },
  { id: 2, title: "All Orders", url: "/dashboard-orders", Icon: FiShoppingBag },
  { id: 3, title: "All Products", url: "/dashboard-products", Icon: FiPackage },
  { id: 4, title: "Create Product", url: "/dashboard-create-product", Icon: FiPlusSquare },
  { id: 5, title: "All Events", url: "/dashboard-events", Icon: MdOutlineLocalOffer },
  { id: 6, title: "Create Event", url: "/dashboard-create-event", Icon: AiOutlinePlusCircle },
  { id: 7, title: "Withdraw Money", url: "/dashboard-withdraw-money", Icon: MdOutlinePayment },
  { id: 8, title: "Shop Inbox", url: "/dashboard-messages", Icon: BiMessageSquareDetail },
  { id: 9, title: "Discount Codes", url: "/dashboard-coupouns", Icon: AiOutlineGift },
  { id: 10, title: "Refunds", url: "/dashboard-refunds", Icon: HiOutlineReceiptRefund },
  { id: 11, title: "Settings", url: "/settings", Icon: AiOutlineSetting },
];

const DashboardSideBar = ({ active }) => {
  return (
    <div className="w-full h-[90vh] bg-white shadow-sm overflow-y-scroll sticky top-0 left-0 z-10">
      {items.map(({ id, title, url, Icon }) => (
        <div className="w-full flex items-center p-4" key={id}>
          <Link to={url} className="w-full flex items-center">
            <Icon
              size={30}
              color={active === id ? "crimson" : "#555"}
            />
            <h5
              className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
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

export default DashboardSideBar;

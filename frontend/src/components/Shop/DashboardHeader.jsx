import { Link } from "react-router-dom";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import { useSelector } from "react-redux";
import { imageUrl } from "../../utils/imageUrl";
import RoleSwitchButton from "../Layout/RoleSwitchButton";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  const avatar = seller?.avatar?.url
    ? imageUrl(seller.avatar.url)
    : "https://cdn.simpleicons.org/shopify";

  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <Link to="/">
        <img
          src="/home-logo.png"
          alt="AJ MART"
          className="h-[50px] w-auto object-contain"
        />
      </Link>

      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <RoleSwitchButton
            direction="toBuyer"
            className="hidden 800px:flex px-4 h-[38px] bg-[#3321c8] text-white rounded-[4px] items-center mr-3 text-[14px]"
          />
          <Link to="/dashboard-coupouns" className="800px:block hidden">
            <AiOutlineGift color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link to="/dashboard-events" className="800px:block hidden">
            <MdOutlineLocalOffer color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link to="/dashboard-products" className="800px:block hidden">
            <FiShoppingBag color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link to="/dashboard-orders" className="800px:block hidden">
            <FiPackage color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link to="/dashboard-messages" className="800px:block hidden">
            <BiMessageSquareDetail color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link to="/shop/me">
            <img
              src={avatar}
              alt=""
              className="w-[45px] h-[45px] rounded-full object-cover"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;

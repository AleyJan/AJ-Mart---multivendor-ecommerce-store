import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardHeader from "../components/Shop/DashboardHeader";
import DashboardSideBar from "../components/Shop/DashboardSideBar";

// Shared shell for every seller dashboard route: top header + left sidebar + content.
const ShopDashboardLayout = ({ active, children }) => {
  const navigate = useNavigate();
  const { isSeller, isLoading } = useSelector((state) => state.seller);

  useEffect(() => {
    if (!isLoading && !isSeller) navigate("/shop-login");
  }, [isLoading, isSeller, navigate]);

  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={active} />
        </div>
        <div className="w-full min-h-[90vh] bg-[#f5f5f5]">{children}</div>
      </div>
    </div>
  );
};

export default ShopDashboardLayout;

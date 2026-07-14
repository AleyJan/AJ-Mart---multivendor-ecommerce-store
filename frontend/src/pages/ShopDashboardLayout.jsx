import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/Shop/DashboardHeader";
import DashboardSideBar from "../components/Shop/DashboardSideBar";
import { useSellerAccess } from "../routes/useSessions";

// Shared shell for every seller dashboard route: top header + left sidebar + content.
const ShopDashboardLayout = ({ active, children }) => {
  const navigate = useNavigate();
  const { valid, resolving } = useSellerAccess();

  useEffect(() => {
    if (!resolving && !valid) navigate("/shop-login");
  }, [resolving, valid, navigate]);

  // Don't flash dashboard content while resolving or for an untrusted session.
  if (resolving || !valid) return null;

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

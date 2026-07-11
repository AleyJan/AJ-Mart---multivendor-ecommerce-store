import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminHeader from "../components/Admin/AdminHeader";
import AdminSideBar from "../components/Admin/AdminSideBar";

// Shared shell for every admin route: top header + left sidebar + content.
// Only users with role "Admin" may view it.
const AdminDashboardLayout = ({ active, children }) => {
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (!loading && (!user || user.role !== "Admin")) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading || !user || user.role !== "Admin") return null;

  return (
    <div>
      <AdminHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <AdminSideBar active={active} />
        </div>
        <div className="w-full min-h-[90vh] bg-[#f5f5f5]">{children}</div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;

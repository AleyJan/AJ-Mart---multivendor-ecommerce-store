import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { imageUrl } from "../../utils/imageUrl";

const AdminHeader = () => {
  const { user } = useSelector((state) => state.user);
  const avatar = user?.avatar?.url
    ? imageUrl(user.avatar.url)
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
        <span className="hidden 800px:block pr-3 font-[500] text-gray-600">
          Admin
        </span>
        <img
          src={avatar}
          alt=""
          className="w-[45px] h-[45px] rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default AdminHeader;

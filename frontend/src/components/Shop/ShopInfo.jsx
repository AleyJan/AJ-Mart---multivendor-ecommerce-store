import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { imageUrl } from "../../utils/imageUrl";

const ShopInfo = ({ shopName, shop, products: productsProp, isOwner }) => {
  const navigate = useNavigate();
  const name = shop?.name || shopName;
  const products = productsProp || [];

  const logoutHandler = () => {
    axios
      .get(`${server}/shop/logout`, { withCredentials: true })
      .then(() => {
        toast.success("Logged out of your shop.");
        navigate("/");
        window.location.reload(true);
      })
      .catch(() => toast.error("Logout failed"));
  };

  const avatar = shop?.avatar?.url
    ? imageUrl(shop.avatar.url)
    : products[0]?.shop?.shop_avatar?.url ||
      "https://cdn.simpleicons.org/shopify";

  const allReviews = products.flatMap((p) => p.reviews || []);
  const shopRating = allReviews.length
    ? allReviews.reduce((a, r) => a + (r.rating || 0), 0) / allReviews.length
    : null;

  const joinedOn = shop?.createdAt
    ? new Date(shop.createdAt).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  return (
    <div>
      <div className="w-full py-5">
        <div className="w-full flex items-center justify-center">
          <img
            src={avatar}
            alt=""
            className="w-[120px] h-[120px] 800px:w-[150px] 800px:h-[150px] object-cover rounded-full"
          />
        </div>
        <h3 className="text-center py-2 text-[18px] 800px:text-[20px]">
          {name}
        </h3>
        <p className="text-[14px] 800px:text-[15px] text-[#000000a6] p-[10px] flex items-center">
          {shop?.description ||
            "This shop sells quality products with fast shipping and reliable support."}
        </p>
      </div>

      <div className="p-3">
        <h5 className="font-[600]">Address</h5>
        <h4 className="text-[#000000a6]">{shop?.address || "-"}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Phone Number</h5>
        <h4 className="text-[#000000a6]">{shop?.phoneNumber || "-"}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Total Products</h5>
        <h4 className="text-[#000000a6]">{products.length}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Shop Ratings</h5>
        <h4 className="text-[#000000b0]">
          {shopRating != null ? `${shopRating.toFixed(1)}/5` : "-/5"}
        </h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Joined On</h5>
        <h4 className="text-[#000000b0]">{joinedOn}</h4>
      </div>

      {isOwner ? (
        <div className="py-3 px-4">
          <div
            className="bg-[#000000a2] text-white cursor-pointer rounded-[4px] h-[42px] w-full flex items-center justify-center"
            onClick={() => navigate("/settings")}
          >
            <span>Edit Shop</span>
          </div>
          <div
            className="bg-[#e44343] text-white cursor-pointer rounded-[4px] h-[42px] w-full flex items-center justify-center mt-3"
            onClick={logoutHandler}
          >
            <span>Log out</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ShopInfo;

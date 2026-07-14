import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ShopInfo from "../components/Shop/ShopInfo";
import ShopProfileData from "../components/Shop/ShopProfileData";
import styles from "../styles/styles";
import { getAllProductsShop } from "../redux/actions/product";
import { getAllEventsShop } from "../redux/actions/event";
import { normalizeProduct, normalizeEvent } from "../utils/normalizeShopItem";
import { useSellerAccess } from "../routes/useSessions";

const ShopHomePage = () => {
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);
  const { valid, resolving } = useSellerAccess();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!resolving && !valid) navigate("/shop-login");
  }, [resolving, valid, navigate]);

  useEffect(() => {
    if (valid && seller?._id) {
      dispatch(getAllProductsShop(seller._id));
      dispatch(getAllEventsShop(seller._id));
    }
  }, [dispatch, valid, seller]);

  if (resolving || !valid || !seller) return null;

  const normProducts = (products || []).map(normalizeProduct);
  const normEvents = (events || []).map(normalizeEvent);

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* Seller top bar */}
      <div className="w-full bg-white shadow-sm">
        <div
          className={`${styles.section} flex items-center justify-between h-[70px]`}
        >
          <Link to="/">
            <h1 className="text-[24px] font-extrabold text-[#f0a500]">
AJ MART
            </h1>
          </Link>
          <Link to="/dashboard">
            <div className="bg-black px-5 h-[40px] rounded-[5px] flex items-center justify-center cursor-pointer">
              <span className="text-white text-[14px] 800px:text-[16px]">
                Go to Dashboard
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Shop info + tabs */}
      <div className={`${styles.section} block 800px:flex py-10 justify-between`}>
        <div className="w-full 800px:w-[25%] bg-white rounded-[4px] shadow-sm mb-6 800px:mb-0">
          <ShopInfo shop={seller} products={products || []} isOwner={true} />
        </div>
        <div className="w-full 800px:w-[72%] rounded-[4px]">
          <ShopProfileData
            shopName={seller.name}
            products={normProducts}
            events={normEvents}
          />
        </div>
      </div>
    </div>
  );
};

export default ShopHomePage;

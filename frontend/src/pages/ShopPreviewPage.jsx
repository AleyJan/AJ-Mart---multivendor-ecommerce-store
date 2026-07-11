import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ShopInfo from "../components/Shop/ShopInfo";
import ShopProfileData from "../components/Shop/ShopProfileData";
import styles from "../styles/styles";
import { server } from "../server";
import { useCatalogProducts, useCatalogEvents } from "../utils/catalog";

const ShopPreviewPage = () => {
  const { name } = useParams();
  const shopName = decodeURIComponent(name || "");
  const products = useCatalogProducts().filter((p) => p.shop.name === shopName);
  const events = useCatalogEvents().filter((e) => e.shop.name === shopName);

  const shopId = products[0]?.shop?._id;
  const [shop, setShop] = useState(null);

  useEffect(() => {
    if (!shopId) return;
    axios
      .get(`${server}/shop/get-shop-info/${shopId}`)
      .then((res) => setShop(res.data.shop))
      .catch(() => {});
  }, [shopId]);

  return (
    <div>
      <Header />
      <div className="w-full bg-[#f5f5f5]">
        <div className={`${styles.section} block 800px:flex py-10 justify-between`}>
          <div className="w-full 800px:w-[25%] bg-white rounded-[4px] shadow-sm h-full 800px:sticky 800px:top-[80px] left-0 z-0 mb-6 800px:mb-0">
            <ShopInfo shopName={shopName} shop={shop} products={products} />
          </div>
          <div className="w-full 800px:w-[72%] rounded-[4px]">
            <ShopProfileData
              shopName={shopName}
              products={products}
              events={events}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopPreviewPage;

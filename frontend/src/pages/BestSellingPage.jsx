import { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import { useCatalogProducts } from "../utils/catalog";

const BestSellingPage = () => {
  const allProducts = useCatalogProducts();
  const [data, setData] = useState([]);

  useEffect(() => {
    const sorted = [...allProducts].sort((a, b) => b.total_sell - a.total_sell);
    setData(sorted);
    window.scrollTo(0, 0);
  }, [allProducts]);

  return (
    <div>
      <Header activeHeading={2} />
      <div className="w-full bg-[#f5f5f5] min-h-screen">
        <div className={`${styles.section} py-10`}>
          <h2 className="text-[25px] font-[600] mb-6">Best Selling</h2>
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px]">
            {data.map((item) => (
              <ProductCard data={item} key={item.id} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BestSellingPage;

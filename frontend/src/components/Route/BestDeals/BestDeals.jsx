import { useEffect, useState } from "react";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";
import { useCatalogProducts } from "../../../utils/catalog";

const BestDeals = () => {
  const allProducts = useCatalogProducts();
  const [data, setData] = useState([]);

  useEffect(() => {
    // Best deals = top sellers
    const sorted = [...allProducts].sort((a, b) => b.total_sell - a.total_sell);
    setData(sorted.slice(0, 5));
  }, [allProducts]);

  return (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1>Best Deals</h1>
      </div>
      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
        {data.map((item) => (
          <ProductCard data={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default BestDeals;

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import { useCatalogProducts } from "../utils/catalog";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const allProducts = useCatalogProducts();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (category === null) {
      setData(allProducts);
    } else {
      setData(allProducts.filter((p) => p.category === category));
    }
    window.scrollTo(0, 0);
  }, [category, allProducts]);

  return (
    <div>
      <Header activeHeading={3} />
      <div className="w-full bg-[#f5f5f5] min-h-screen">
        <div className={`${styles.section} py-10`}>
          {category ? (
            <h2 className="text-[22px] font-[600] mb-6">{category}</h2>
          ) : null}

          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px]">
            {data.map((item) => (
              <ProductCard data={item} key={item.id} />
            ))}
          </div>

          {data.length === 0 ? (
            <h1 className="text-center w-full pb-[100px] text-[20px] text-gray-500">
              No products found for this category!
            </h1>
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;

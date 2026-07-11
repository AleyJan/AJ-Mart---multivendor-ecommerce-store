import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";
import { useCatalogProducts } from "../../../utils/catalog";

const FeaturedProduct = () => {
  const allProducts = useCatalogProducts();

  return (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1>Featured Products</h1>
      </div>
      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
        {allProducts.map((item) => (
          <ProductCard data={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;

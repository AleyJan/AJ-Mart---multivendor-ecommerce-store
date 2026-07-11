import { useEffect, useState } from "react";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";
import { useCatalogProducts } from "../../utils/catalog";

const SuggestedProduct = ({ data }) => {
  const allProducts = useCatalogProducts();
  const [related, setRelated] = useState([]);

  useEffect(() => {
    // Same-category products first; fall back to other products so the
    // section is never empty with the current small dataset.
    let d = allProducts.filter(
      (p) => p.category === data.category && p.id !== data.id
    );
    if (d.length === 0) {
      d = allProducts.filter((p) => p.id !== data.id).slice(0, 5);
    }
    setRelated(d);
  }, [data, allProducts]);

  return (
    <div className={`${styles.section} p-4`}>
      {data ? (
        <>
          <h2 className="text-[25px] font-[500] border-b mb-5 pb-2">
            Related Products
          </h2>
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {related.map((item) => (
              <ProductCard data={item} key={item.id} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SuggestedProduct;

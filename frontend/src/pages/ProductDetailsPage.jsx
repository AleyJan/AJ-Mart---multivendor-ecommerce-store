import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductDetails from "../components/Products/ProductDetails";
import ProductDetailsInfo from "../components/Products/ProductDetailsInfo";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import styles from "../styles/styles";
import { useCatalogProducts, useCatalogEvents } from "../utils/catalog";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const allProducts = useCatalogProducts();
  const allEvents = useCatalogEvents();

  // Look in products first, then events.
  const data =
    allProducts.find((p) => String(p.id) === id) ||
    allEvents.find((e) => String(e.id) === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const shopKey = data?.shop?._id || data?.shopId || data?.shop?.name;
  const shopProducts = shopKey
    ? allProducts.filter(
        (p) => (p.shop?._id || p.shopId || p.shop?.name) === shopKey
      )
    : [];
  const totalReviews = shopProducts.reduce(
    (acc, p) => acc + (p.reviews?.length || 0),
    0
  );

  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      {data ? (
        <div className={`${styles.section} mt-5`}>
          <ProductDetailsInfo
            data={data}
            totalProducts={shopProducts.length}
            totalReviews={totalReviews}
          />
        </div>
      ) : null}
      {data ? <SuggestedProduct data={data} /> : null}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;

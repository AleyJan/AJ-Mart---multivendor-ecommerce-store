import { useMemo } from "react";
import { useSelector } from "react-redux";
import { productData, eventData } from "../static/data";
import { normalizeProduct, normalizeEvent } from "./normalizeShopItem";

const shopKey = (p) => p.shop?._id || p.shopId || p.shop?.name;

// Compute each shop's rating as the average of every review across every one
// of its products, then patch it back onto each product's embedded shop.
const withComputedShopRatings = (products) => {
  const reviewsByShop = {};
  products.forEach((p) => {
    const key = shopKey(p);
    if (!key) return;
    (reviewsByShop[key] ||= []).push(...(p.reviews || []));
  });
  const ratingByShop = {};
  Object.entries(reviewsByShop).forEach(([key, reviews]) => {
    if (!reviews.length) return;
    ratingByShop[key] =
      reviews.reduce((a, r) => a + (r.rating || 0), 0) / reviews.length;
  });
  return products.map((p) => {
    const key = shopKey(p);
    return ratingByShop[key] != null
      ? { ...p, shop: { ...p.shop, ratings: ratingByShop[key] } }
      : p;
  });
};

// Buyer-facing catalogue = real seller products (backend, normalized) FIRST,
// then the pre-seeded demo products. Both kept. Memoized on the backend list so
// the merged array reference is stable across renders.
export const useCatalogProducts = () => {
  const { allProducts } = useSelector((state) => state.products);
  return useMemo(
    () => [
      ...withComputedShopRatings((allProducts || []).map(normalizeProduct)),
      ...productData,
    ],
    [allProducts]
  );
};

export const useCatalogEvents = () => {
  const { allEvents } = useSelector((state) => state.events);
  return useMemo(
    () => [
      ...withComputedShopRatings((allEvents || []).map(normalizeEvent)),
      ...eventData,
    ],
    [allEvents]
  );
};

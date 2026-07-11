import { useMemo } from "react";
import { useSelector } from "react-redux";
import { productData, eventData } from "../static/data";
import { normalizeProduct, normalizeEvent } from "./normalizeShopItem";

// Buyer-facing catalogue = real seller products (backend, normalized) FIRST,
// then the pre-seeded demo products. Both kept. Memoized on the backend list so
// the merged array reference is stable across renders.
export const useCatalogProducts = () => {
  const { allProducts } = useSelector((state) => state.products);
  return useMemo(
    () => [...(allProducts || []).map(normalizeProduct), ...productData],
    [allProducts]
  );
};

export const useCatalogEvents = () => {
  const { allEvents } = useSelector((state) => state.events);
  return useMemo(
    () => [...(allEvents || []).map(normalizeEvent), ...eventData],
    [allEvents]
  );
};

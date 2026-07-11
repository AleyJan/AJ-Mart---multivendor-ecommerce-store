import { backend_url } from "../server";

const toImage = (img) => ({
  url: img?.url?.startsWith("http") ? img.url : `${backend_url}${img?.url || ""}`,
});

// Map a backend product to the shape ProductCard/ProductDetails expect.
export const normalizeProduct = (p) => ({
  id: p._id,
  shopId: p.shopId,
  name: p.name,
  description: p.description,
  category: p.category,
  image_Url:
    p.images && p.images.length ? p.images.map(toImage) : [{ url: "" }],
  shop: {
    name: p.shop?.name,
    shop_avatar: {
      url: p.shop?.avatar?.url
        ? `${backend_url}${p.shop.avatar.url}`
        : "",
    },
    ratings: p.shop?.ratings || 0,
  },
  originalPrice: p.originalPrice || null,
  discountPrice: p.discountPrice,
  rating: p.ratings || 0,
  total_sell: p.sold_out || 0,
  stock: p.stock,
  reviews: p.reviews || [],
});

// Map a backend event (same as product + dates) to the EventCard shape.
export const normalizeEvent = (e) => ({
  ...normalizeProduct(e),
  start_Date: e.start_Date,
  Finish_Date: e.Finish_Date,
});

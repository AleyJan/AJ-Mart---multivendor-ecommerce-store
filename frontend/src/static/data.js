// Category images (Unsplash CDN). Swap freely for your own assets.
const u = (id, w = 600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80`;

// ---------------- Categories ----------------
export const categoriesData = [
  { id: 1, title: "Computers and Laptops", image_Url: u("1517336714731-489689fd1ca8", 300) },
  { id: 2, title: "Cosmetics and Body Care", image_Url: u("1596462502278-27bfdc403348", 300) },
  { id: 3, title: "Accessories", image_Url: u("1611591437281-460bfbe1220a", 300) },
  { id: 4, title: "Cloths", image_Url: u("1521572163474-6864f9cf17ab", 300) },
  { id: 5, title: "Shoes", image_Url: u("1542291026-7eec264c27ff", 300) },
  { id: 6, title: "Gifts", image_Url: u("1549465220-1a8b9238cd48", 300) },
  { id: 7, title: "Pet Care", image_Url: u("1450778869180-41d0601e046e", 300) },
  { id: 8, title: "Mobile and Tablets", image_Url: u("1592750475338-74b7b21085ab", 300) },
  { id: 9, title: "Music and Gaming", image_Url: u("1505740420928-5e560c06d30e", 300) },
  { id: 10, title: "Others", image_Url: u("1607082348824-0a96f2a4b9da", 300) },
];

// ---------------- Navbar links ----------------
export const navItems = [
  { title: "Home", url: "/" },
  { title: "Best Selling", url: "/best-selling" },
  { title: "Products", url: "/products" },
  { title: "Events", url: "/events" },
  { title: "FAQ", url: "/faq" },
];

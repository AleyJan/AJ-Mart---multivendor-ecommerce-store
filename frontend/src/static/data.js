// Real product/category images (Unsplash CDN). Swap freely for your own assets.
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

// ---------------- Products ----------------
// originalPrice -> strikethrough (null if there is no discount)
// discountPrice -> the current selling price
export const productData = [
  {
    id: 1,
    category: "Mobile and Tablets",
    name: "Iphone 14 pro max 256 GB SSD and 8 GB RAM silver colour",
    description:
      "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.",
    image_Url: [{ url: u("1592750475338-74b7b21085ab") }, { url: u("1510557880182-3d4d3cba35a5") }],
    shop: { name: "Amazon Ltd", shop_avatar: { url: u("1607082348824-0a96f2a4b9da", 100) }, ratings: 4.2 },
    originalPrice: null,
    discountPrice: 1099,
    rating: 4,
    total_sell: 80,
    stock: 10,
  },
  {
    id: 2,
    category: "Computers and Laptops",
    name: "MacBook Pro M2 chipset 256GB SSD 8GB RAM space grey colour",
    description:
      "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.",
    image_Url: [{ url: u("1517336714731-489689fd1ca8") }, { url: u("1541807084-5c52b6b3adef") }],
    shop: { name: "Apple Inc.", shop_avatar: { url: u("1517336714731-489689fd1ca8", 100) }, ratings: 4.5 },
    originalPrice: 1099,
    discountPrice: 1049,
    rating: 4,
    total_sell: 75,
    stock: 10,
  },
  {
    id: 3,
    category: "Accessories",
    name: "New Fashionable Watch for men 2023 with leather strap",
    description:
      "Product details are a crucial part of any eCommerce website. A well-written product description can also be a powerful marketing tool that can help to increase sales and inform the customer about features and materials.",
    image_Url: [{ url: u("1523275335684-37898b6baf30") }, { url: u("1524592094714-0f0654e20314") }],
    shop: { name: "Shahriar Watch House", shop_avatar: { url: u("1523275335684-37898b6baf30", 100) }, ratings: 4.1 },
    originalPrice: 100,
    discountPrice: 79,
    rating: 4,
    total_sell: 62,
    stock: 10,
  },
  {
    id: 4,
    category: "Shoes",
    name: "New Trend shoes for gents with all sizes available",
    description:
      "Product details are a crucial part of any eCommerce website. A well-written product description can also be a powerful marketing tool that can help to increase sales and inform the customer about features and materials.",
    image_Url: [{ url: u("1542291026-7eec264c27ff") }, { url: u("1460353581641-37baddab0fa2") }],
    shop: { name: "Alisha Shoes Mart", shop_avatar: { url: u("1542291026-7eec264c27ff", 100) }, ratings: 4.0 },
    originalPrice: 120,
    discountPrice: 89,
    rating: 4,
    total_sell: 49,
    stock: 10,
  },
  {
    id: 5,
    category: "Music and Gaming",
    name: "Gaming Headphone Asus with multiple colour and free delivery",
    description:
      "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales. Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information.",
    image_Url: [{ url: u("1505740420928-5e560c06d30e") }, { url: u("1583394838336-acd977736f90") }],
    shop: { name: "Asus Ltd", shop_avatar: { url: u("1505740420928-5e560c06d30e", 100) }, ratings: 4.2 },
    originalPrice: 300,
    discountPrice: 239,
    rating: 4,
    total_sell: 20,
    stock: 10,
  },
  {
    id: 6,
    category: "Cosmetics and Body Care",
    name: "Premium skincare gift set with natural ingredients",
    description:
      "A well-written product description can also be a powerful marketing tool that can help to increase sales and inform the customer about features and ingredients.",
    image_Url: [{ url: u("1556228720-195a672e8a03") }, { url: u("1596462502278-27bfdc403348") }],
    shop: { name: "Glow Cosmetics", shop_avatar: { url: u("1556228720-195a672e8a03", 100) }, ratings: 4.3 },
    originalPrice: 90,
    discountPrice: 69,
    rating: 4,
    total_sell: 35,
    stock: 10,
  },
  {
    id: 7,
    category: "Cloths",
    name: "Stylish cotton casual shirt for men all sizes available",
    description:
      "A well-written product description can also be a powerful marketing tool that can help to increase sales and inform the customer about fabric and fit.",
    image_Url: [{ url: u("1521572163474-6864f9cf17ab") }, { url: u("1602810318383-e386cc2a3ccf") }],
    shop: { name: "Trendy Wear", shop_avatar: { url: u("1521572163474-6864f9cf17ab", 100) }, ratings: 4.0 },
    originalPrice: 60,
    discountPrice: 39,
    rating: 4,
    total_sell: 58,
    stock: 10,
  },
  {
    id: 8,
    category: "Gifts",
    name: "Special surprise gift box with assorted items inside",
    description:
      "A well-written product description can also be a powerful marketing tool that can help to increase sales and inform the customer about contents.",
    image_Url: [{ url: u("1549465220-1a8b9238cd48") }, { url: u("1513885535751-8b9238bd345a") }],
    shop: { name: "Gift Gallery", shop_avatar: { url: u("1549465220-1a8b9238cd48", 100) }, ratings: 4.4 },
    originalPrice: null,
    discountPrice: 45,
    rating: 4,
    total_sell: 41,
    stock: 10,
  },
];

// ---------------- Events ----------------
// Finish_Date drives the countdown timer (set relative to now so it stays live).
export const eventData = [
  {
    id: 1,
    category: "Mobile and Tablets",
    name: "Iphone 14 pro max 8/256gb",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum molestias sequi, officiis iusto assumenda libero explicabo beatae amet consequuntur veniam fugiat corporis minus adipisci modi a aliquam maiores exercitationem provident. Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
    image_Url: [
      { url: u("1592750475338-74b7b21085ab") },
      { url: u("1510557880182-3d4d3cba35a5") },
    ],
    shop: { name: "Apple Inc.", shop_avatar: { url: u("1517336714731-489689fd1ca8", 100) }, ratings: 4.5 },
    originalPrice: 1099,
    discountPrice: 999,
    rating: 4,
    total_sell: 120,
    stock: 10,
    start_Date: new Date(),
    Finish_Date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: 5,
    category: "Music and Gaming",
    name: "Gaming Headphone Asus limited edition",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum molestias sequi, officiis iusto assumenda libero explicabo beatae amet consequuntur veniam fugiat corporis minus adipisci modi a aliquam maiores exercitationem provident.",
    image_Url: [
      { url: u("1505740420928-5e560c06d30e") },
      { url: u("1583394838336-acd977736f90") },
    ],
    shop: { name: "Asus Ltd", shop_avatar: { url: u("1505740420928-5e560c06d30e", 100) }, ratings: 4.2 },
    originalPrice: 300,
    discountPrice: 199,
    rating: 4,
    total_sell: 60,
    stock: 10,
    start_Date: new Date(),
    Finish_Date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
  },
];

// ---------------- Shops ----------------
// Extra shop-level metadata keyed by shop name (products reference shop by name).
export const shopData = [
  {
    name: "Amazon Ltd",
    description:
      "This shop offers a wide range of quality electronics with fast shipping and reliable customer support.",
    address: "4678 Honeysuckle Lane, Seattle",
    phoneNumber: 1783811512,
    ratings: 4.2,
    createdAt: "2023-03-17",
  },
  {
    name: "Apple Inc.",
    description:
      "Official reseller of premium laptops and mobile devices with genuine warranty.",
    address: "1 Infinite Loop, Cupertino",
    phoneNumber: 1800275273,
    ratings: 4.5,
    createdAt: "2022-11-05",
  },
  {
    name: "Shahriar Watch House",
    description: "Fashionable watches for men and women at affordable prices.",
    address: "12 Market Street, Dhaka",
    phoneNumber: 1712345678,
    ratings: 4.1,
    createdAt: "2023-01-22",
  },
  {
    name: "Alisha Shoes Mart",
    description: "Trendy footwear for every occasion, all sizes available.",
    address: "88 Fashion Ave, New York",
    phoneNumber: 1955512345,
    ratings: 4.0,
    createdAt: "2023-05-09",
  },
  {
    name: "Asus Ltd",
    description: "Gaming gear and accessories with limited-edition releases.",
    address: "45 Tech Park, Taipei",
    phoneNumber: 1886221234,
    ratings: 4.2,
    createdAt: "2022-08-14",
  },
  {
    name: "Glow Cosmetics",
    description: "Natural skincare and beauty products made with care.",
    address: "23 Rose Lane, London",
    phoneNumber: 4402079460,
    ratings: 4.3,
    createdAt: "2023-02-28",
  },
  {
    name: "Trendy Wear",
    description: "Stylish and comfortable clothing for the modern wardrobe.",
    address: "56 Denim Road, Los Angeles",
    phoneNumber: 1310555078,
    ratings: 4.0,
    createdAt: "2023-04-11",
  },
  {
    name: "Gift Gallery",
    description: "Curated gift boxes and surprises for every celebration.",
    address: "7 Present Street, Toronto",
    phoneNumber: 1416555920,
    ratings: 4.4,
    createdAt: "2023-06-01",
  },
];

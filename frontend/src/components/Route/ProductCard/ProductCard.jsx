import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineEye,
  AiOutlineShoppingCart,
  AiOutlineLeft,
  AiOutlineRight,
} from "react-icons/ai";
import { toast } from "react-toastify";
import styles from "../../../styles/styles";
import Ratings from "../../Products/Ratings";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist";
import { addTocart } from "../../../redux/actions/cart";

const ProductCard = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [click, setClick] = useState(false); // wishlist
  const [open, setOpen] = useState(false); // details popup
  const [imgIndex, setImgIndex] = useState(0); // active slide

  const images = data.image_Url || [];

  const goPrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };
  const goNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  const name =
    data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name;

  // reflect whether this product is already in the wishlist
  useEffect(() => {
    setClick(wishlist && wishlist.some((i) => i.id === data.id));
  }, [wishlist, data.id]);

  const removeFromWishlistHandler = () => {
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = () => {
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = () => {
    const isItemExists = cart && cart.find((i) => i.id === data.id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else if (data.stock < 1) {
      toast.error("Product stock limited!");
    } else {
      dispatch(addTocart({ ...data, qty: 1 }));
      toast.success("Item added to cart successfully!");
    }
  };

  return (
    <div className="w-full min-h-[370px] bg-white rounded-lg shadow-sm p-3 cursor-pointer">
      {/* Top row: image (left) + action icons column (right) */}
      <div className="flex justify-between items-start">
        <div className="relative w-[calc(100%-34px)] group">
          <Link to={`/product/${data.id}`} className="block">
            <img
              src={images[imgIndex]?.url}
              alt=""
              className="w-full h-[170px] object-contain"
            />
          </Link>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition"
                title="Previous image"
              >
                <AiOutlineLeft size={16} />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition"
                title="Next image"
              >
                <AiOutlineRight size={16} />
              </button>

              <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`h-[6px] w-[6px] rounded-full ${
                      i === imgIndex ? "bg-[#3321c8]" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>

        <div className="flex flex-col items-center gap-4 pt-2">
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer"
              onClick={removeFromWishlistHandler}
              color="red"
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer"
              onClick={addToWishlistHandler}
              color="#333"
              title="Add to wishlist"
            />
          )}

          <AiOutlineEye
            size={22}
            className="cursor-pointer"
            onClick={() => setOpen(true)}
            color="#333"
            title="Quick view"
          />

          <AiOutlineShoppingCart
            size={25}
            className="cursor-pointer"
            onClick={addToCartHandler}
            color="#444"
            title="Add to cart"
          />
        </div>
      </div>

      {/* Shop name */}
      <Link to={`/shop/preview/${encodeURIComponent(data.shop.name)}`}>
        <span className="block text-[13px] text-blue-400 pt-3 hover:underline">
          {data.shop.name}
        </span>
      </Link>

      {/* Product name */}
      <Link to={`/product/${data.id}`}>
        <h4 className="pb-3 font-[500] text-[#333]">{name}</h4>
      </Link>

      {/* Ratings */}
      <Ratings rating={data.rating} />

      {/* Price + sold count */}
      <div className="py-2 flex items-center justify-between">
        <div className="flex items-center">
          <h5 className={styles.productDiscountPrice}>{data.discountPrice}$</h5>
          {data.originalPrice ? (
            <h4 className={styles.price}>{data.originalPrice}$</h4>
          ) : null}
        </div>
        <span className="font-[400] text-[15px] text-[#68d284]">
          {data.total_sell} sold
        </span>
      </div>

      {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
    </div>
  );
};

export default ProductCard;

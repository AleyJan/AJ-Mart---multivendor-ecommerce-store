import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "../../styles/styles";
import Ratings from "./Ratings";
import { addToWishlist, removeFromWishlist } from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { server } from "../../server";

const ProductDetails = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMessageSubmit = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to message the seller");
      return navigate("/login");
    }
    if (!data.shopId) {
      toast.error("Messaging is only available for seller products.");
      return;
    }
    const groupTitle = data.shopId + user._id;
    await axios
      .post(`${server}/conversation/create-new-conversation`, {
        groupTitle,
        userId: user._id,
        sellerId: data.shopId,
      })
      .then((res) => navigate(`/inbox?${res.data.conversation._id}`))
      .catch((error) =>
        toast.error(error.response?.data?.message || "Could not start chat")
      );
  };
  const [count, setCount] = useState(1);
  const [select, setSelect] = useState(0);
  const [click, setClick] = useState(false);

  useEffect(() => {
    setClick(wishlist && data && wishlist.some((i) => i.id === data.id));
  }, [wishlist, data]);

  if (!data) {
    return (
      <div className={`${styles.section} py-20 text-center text-[20px] text-gray-500`}>
        Product not found.
      </div>
    );
  }

  const incrementCount = () => setCount(count + 1);
  const decrementCount = () => count > 1 && setCount(count - 1);

  const removeFromWishlistHandler = () => dispatch(removeFromWishlist(data));
  const addToWishlistHandler = () => dispatch(addToWishlist(data));

  const addToCartHandler = () => {
    const isItemExists = cart && cart.find((i) => i.id === data.id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else if (data.stock < count) {
      toast.error("Product stock limited!");
    } else {
      dispatch(addTocart({ ...data, qty: count }));
      toast.success("Item added to cart successfully!");
    }
  };

  return (
    <div className="bg-white">
      <div className={`${styles.section} w-[90%] 800px:w-[80%] py-5`}>
        <div className="w-full py-5">
          <div className="block w-full 800px:flex">
            {/* Left: images */}
            <div className="w-full 800px:w-[50%]">
              <img
                src={data.image_Url[select]?.url}
                alt=""
                className="w-full h-[280px] 800px:h-[400px] object-contain"
              />
              <div className="w-full flex gap-2 mt-3">
                {data.image_Url.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt=""
                    onClick={() => setSelect(index)}
                    className={`h-[60px] w-[60px] 800px:h-[80px] 800px:w-[80px] object-cover rounded cursor-pointer border ${
                      select === index ? "border-[#3321c8]" : "border-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right: details */}
            <div className="w-full 800px:w-[50%] pt-5 800px:pt-0 800px:pl-10">
              <h1 className="text-[20px] 800px:text-[25px] font-[600] font-Roboto text-[#333]">
                {data.name}
              </h1>
              <p className="mt-3 text-[14px] 800px:text-[15px] text-gray-700">
                {data.description}
              </p>

              <div className="flex pt-3">
                <h4 className={styles.productDiscountPrice}>
                  {data.discountPrice}$
                </h4>
                {data.originalPrice ? (
                  <h3 className={styles.price}>{data.originalPrice}$</h3>
                ) : null}
              </div>

              <div className="flex items-center pt-3">
                <Ratings rating={data.rating} />
                <span className="ml-3 text-[#44a55e] font-[400]">
                  ({data.total_sell}) sold
                </span>
              </div>

              {/* Quantity + wishlist */}
              <div className="flex items-center mt-6 justify-between pr-3">
                <div>
                  <button
                    className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition"
                    onClick={decrementCount}
                  >
                    -
                  </button>
                  <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                    {count}
                  </span>
                  <button
                    className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-r px-4 py-2 shadow-lg hover:opacity-75 transition"
                    onClick={incrementCount}
                  >
                    +
                  </button>
                </div>
                <div>
                  {click ? (
                    <AiFillHeart
                      size={30}
                      className="cursor-pointer"
                      onClick={removeFromWishlistHandler}
                      color="red"
                      title="Remove from wishlist"
                    />
                  ) : (
                    <AiOutlineHeart
                      size={30}
                      className="cursor-pointer"
                      onClick={addToWishlistHandler}
                      color="#333"
                      title="Add to wishlist"
                    />
                  )}
                </div>
              </div>

              <button
                className={`${styles.button} mt-6 rounded-[4px] h-11`}
                onClick={addToCartHandler}
              >
                <span className="text-white flex items-center text-[14px] 800px:text-[16px]">
                  Add to cart <AiOutlineShoppingCart className="ml-1" />
                </span>
              </button>

              {/* Shop info + message */}
              <div className="flex flex-wrap items-center pt-8 gap-y-3">
                <img
                  src={data.shop.shop_avatar.url}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full mr-2 object-cover"
                />
                <div className="pr-4 800px:pr-8">
                  <Link to={`/shop/preview/${encodeURIComponent(data.shop.name)}`}>
                    <h3 className={`${styles.shop_name} !pb-1 !pt-0 hover:underline`}>
                      {data.shop.name}
                    </h3>
                  </Link>
                  <h5 className="pb-1 text-[14px] 800px:text-[15px]">
                    ({(data.shop.ratings ?? 0).toFixed(1)}/5) Ratings
                  </h5>
                </div>
                <div
                  className={`${styles.button} bg-[#6443d1] !h-[42px] !my-0 rounded-[4px]`}
                  onClick={handleMessageSubmit}
                >
                  <span className="text-white flex items-center text-[14px] 800px:text-[16px]">
                    Send Message <AiOutlineMessage className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "../../../styles/styles";
import Ratings from "../../Products/Ratings";
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist";
import { addTocart } from "../../../redux/actions/cart";
import { server } from "../../../server";

const ProductDetailsCard = ({ setOpen, data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [count, setCount] = useState(1);
  const [select, setSelect] = useState(0); // active image index
  const [click, setClick] = useState(false); // wishlist toggle

  useEffect(() => {
    setClick(wishlist && wishlist.some((i) => i.id === data.id));
  }, [wishlist, data.id]);

  const incrementCount = () => setCount(count + 1);
  const decrementCount = () => count > 1 && setCount(count - 1);

  const handleAddToCart = () => {
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

  const removeFromWishlistHandler = () => dispatch(removeFromWishlist(data));
  const addToWishlistHandler = () => dispatch(addToWishlist(data));

  const handleMessageSubmit = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to message the seller");
      return navigate("/login");
    }
    if (!data.shopId) {
      toast.error("Messaging is only available for seller products.");
      return;
    }
    await axios
      .post(`${server}/conversation/create-new-conversation`, {
        groupTitle: data.shopId + user._id,
        userId: user._id,
        sellerId: data.shopId,
      })
      .then((res) => {
        setOpen(false);
        navigate(`/inbox?${res.data.conversation._id}`);
      })
      .catch((error) =>
        toast.error(error.response?.data?.message || "Could not start chat")
      );
  };

  return (
    <div className="bg-[#fff]">
      {data ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[60%] h-[90vh] overflow-y-scroll 800px:h-[75vh] bg-white rounded-md shadow-sm relative p-4">
            <RxCross1
              size={30}
              className="absolute right-3 top-3 z-50 cursor-pointer"
              onClick={() => setOpen(false)}
            />

            <div className="block w-full 800px:flex">
              {/* Left: images */}
              <div className="w-full 800px:w-[50%]">
                <img
                  src={data.image_Url[select]?.url}
                  alt=""
                  className="w-full h-[250px] 800px:h-[300px] object-contain"
                />
                {/* Thumbnails (more than one image per product) */}
                <div className="flex gap-2 mt-3">
                  {data.image_Url.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt=""
                      onClick={() => setSelect(index)}
                      className={`h-[60px] w-[60px] object-cover rounded cursor-pointer border ${
                        select === index ? "border-[#3321c8]" : "border-transparent"
                      }`}
                    />
                  ))}
                </div>

                {/* Shop info */}
                <div className="flex items-center mt-5">
                  <img
                    src={data.shop.shop_avatar.url}
                    alt=""
                    className="w-[50px] h-[50px] rounded-full mr-2 object-cover"
                  />
                  <div>
                    <Link
                      to={`/shop/preview/${encodeURIComponent(data.shop.name)}`}
                      onClick={() => setOpen(false)}
                    >
                      <h3 className={`${styles.shop_name} !pt-0 hover:underline`}>
                        {data.shop.name}
                      </h3>
                    </Link>
                    <h5 className="pb-3 text-[14px] 800px:text-[15px]">
                      ({data.shop.ratings}) Ratings
                    </h5>
                  </div>
                </div>

                <button
                  className={`${styles.button} bg-[#6443d1] mt-4 rounded-[4px] h-11`}
                  onClick={handleMessageSubmit}
                >
                  <span className="text-white flex items-center text-[14px] 800px:text-[16px]">
                    Send Message <AiOutlineMessage className="ml-1" />
                  </span>
                </button>
                <h5 className="text-[14px] 800px:text-[16px] text-[red] mt-5">
                  ({data.total_sell}) Sold out
                </h5>
              </div>

              {/* Right: details */}
              <div className="w-full 800px:w-[50%] pt-5 pl-[5px] pr-[5px]">
                <h1 className="text-[18px] 800px:text-[25px] font-[600] font-Roboto text-[#333]">
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

                <div className="pt-3">
                  <Ratings rating={data.rating} />
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
                  onClick={handleAddToCart}
                >
                  <span className="text-white flex items-center text-[14px] 800px:text-[16px]">
                    Add to cart
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;

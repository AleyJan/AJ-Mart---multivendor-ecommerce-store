import { RxCross1 } from "react-icons/rx";
import { AiOutlineHeart } from "react-icons/ai";
import { BsCartPlus } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import styles from "../../styles/styles";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) =>
    dispatch(removeFromWishlist(data));

  const addToCartHandler = (data) => {
    const newData = { ...data, qty: 1 };
    dispatch(addTocart(newData));
    toast.success("Item added to cart successfully!");
    setOpenWishlist(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-50">
      <div className="fixed top-0 right-0 min-h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenWishlist(false)}
              />
            </div>
            <h5>Wishlist is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenWishlist(false)}
                />
              </div>

              <div className={`${styles.normalFlex} p-4`}>
                <AiOutlineHeart size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {wishlist.length} items
                </h5>
              </div>

              <div className="w-full border-t">
                {wishlist.map((item, index) => (
                  <WishlistSingle
                    key={index}
                    data={item}
                    removeFromWishlistHandler={removeFromWishlistHandler}
                    addToCartHandler={addToCartHandler}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const WishlistSingle = ({
  data,
  removeFromWishlistHandler,
  addToCartHandler,
}) => {
  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center">
        <RxCross1
          className="cursor-pointer"
          onClick={() => removeFromWishlistHandler(data)}
        />
        <img
          src={data.image_Url[0].url}
          alt=""
          className="w-[80px] h-[80px] ml-2 rounded object-cover"
        />

        <div className="pl-[5px]">
          <h1 className="text-[15px]">
            {data.name.length > 25 ? data.name.slice(0, 25) + "..." : data.name}
          </h1>
          <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222]">
            US${data.discountPrice}
          </h4>
        </div>

        <div className="ml-auto">
          <BsCartPlus
            size={20}
            className="cursor-pointer"
            title="Add to cart"
            onClick={() => addToCartHandler(data)}
          />
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

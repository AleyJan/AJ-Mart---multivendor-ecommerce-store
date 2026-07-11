import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CountDown from "./CountDown";
import { addTocart } from "../../redux/actions/cart";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

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
    <div
      className={`w-full bg-white rounded-lg ${
        active ? "unset" : "mb-12"
      } lg:flex p-2`}
    >
      <div className="w-full lg:w-[50%] m-auto flex items-center justify-center">
        <img
          src={data.image_Url[0].url}
          alt=""
          className="max-h-[300px] object-contain"
        />
      </div>

      <div className="w-full lg:w-[50%] flex flex-col justify-center px-3 py-4">
        <h2 className="text-[20px] 800px:text-[25px] font-[600] font-Roboto text-[#333]">
          {data.name}
        </h2>
        <p className="text-gray-600 mt-2 text-[14px] 800px:text-[15px]">
          {data.description}
        </p>

        <div className="flex py-2 justify-between">
          <div className="flex items-center">
            <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
              {data.originalPrice}$
            </h5>
            <h5 className="font-bold text-[20px] text-[#333]">
              {data.discountPrice}$
            </h5>
          </div>
          <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
            {data.total_sell} sold
          </span>
        </div>

        <CountDown data={data} />

        <div className="flex flex-wrap items-center mt-4 gap-3">
          <Link to={`/product/${data.id}`}>
            <div className="bg-black text-white h-[42px] w-[130px] flex items-center justify-center rounded-xl cursor-pointer">
              See Details
            </div>
          </Link>
          <div
            className="bg-black text-white h-[42px] w-[130px] flex items-center justify-center rounded-xl cursor-pointer"
            onClick={addToCartHandler}
          >
            Add to cart
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;

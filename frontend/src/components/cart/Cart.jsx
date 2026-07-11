import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "../../styles/styles";
import { addTocart, removeFromCart } from "../../redux/actions/cart";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => dispatch(removeFromCart(data));

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const quantityChangeHandler = (data) => dispatch(addTocart(data));

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-50">
      <div className="fixed top-0 right-0 min-h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
        {cart && cart.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <h5>Cart is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenCart(false)}
                />
              </div>

              <div className={`${styles.normalFlex} p-4`}>
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {cart.length} items
                </h5>
              </div>

              <div className="w-full border-t">
                {cart.map((item, index) => (
                  <CartSingle
                    key={index}
                    data={item}
                    quantityChangeHandler={quantityChangeHandler}
                    removeFromCartHandler={removeFromCartHandler}
                  />
                ))}
              </div>
            </div>

            <div className="px-5 mb-3">
              <Link to="/checkout">
                <div className="h-[45px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px] px-2">
                  <h1 className="text-[#fff] text-[15px] 800px:text-[18px] font-[600] text-center">
                    Checkout Now (USD${totalPrice})
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;

  const increment = () => {
    if (data.stock < value + 1) {
      toast.error("Product stock limited!");
    } else {
      setValue(value + 1);
      quantityChangeHandler({ ...data, qty: value + 1 });
    }
  };

  const decrement = () => {
    const newValue = value === 1 ? 1 : value - 1;
    setValue(newValue);
    quantityChangeHandler({ ...data, qty: newValue });
  };

  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center">
        <div>
          <div
            className="bg-[#e44343] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
            onClick={increment}
          >
            <HiPlus size={18} color="#fff" />
          </div>
          <span className="pl-[10px]">{value}</span>
          <div
            className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer ml-[2px]"
            onClick={decrement}
          >
            <HiOutlineMinus size={16} color="#7d879c" />
          </div>
        </div>

        <img
          src={data.image_Url[0].url}
          alt=""
          className="w-[80px] h-[80px] ml-2 rounded object-cover"
        />

        <div className="pl-[5px]">
          <h1 className="text-[15px]">
            {data.name.length > 25 ? data.name.slice(0, 25) + "..." : data.name}
          </h1>
          <h4 className="font-[400] text-[15px] text-[#00000082]">
            ${data.discountPrice} * {value}
          </h4>
          <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222]">
            US${totalPrice}
          </h4>
        </div>

        <RxCross1
          className="cursor-pointer ml-auto"
          onClick={() => removeFromCartHandler(data)}
        />
      </div>
    </div>
  );
};

export default Cart;

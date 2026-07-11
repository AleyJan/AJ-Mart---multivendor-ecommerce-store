import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import styles from "../../styles/styles";
import { clearCart } from "../../redux/actions/cart";
import { server } from "../../server";

const Payment = () => {
  const [orderData, setOrderData] = useState(null);
  const [select, setSelect] = useState(1); // 1 = card, 2 = cash on delivery
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const stored = localStorage.getItem("latestOrder");
    if (!stored) {
      navigate("/");
      return;
    }
    setOrderData(JSON.parse(stored));
  }, [navigate]);

  // Create the real order after a successful (or COD) payment.
  const createOrder = async (paymentInfo) => {
    const order = {
      cart: orderData.cart,
      shippingAddress: orderData.shippingAddress,
      user:
        orderData.user || {
          name: orderData.shippingAddress?.fullName,
          email: orderData.shippingAddress?.email,
        },
      totalPrice: orderData.totalPrice,
      paymentInfo,
    };
    await axios
      .post(`${server}/order/create-order`, order, { withCredentials: true })
      .then(() => {
        toast.success("Order placed successfully!");
        dispatch(clearCart());
        localStorage.removeItem("latestOrder");
        navigate("/order/success");
      })
      .catch((err) => toast.error(err.response?.data?.message || "Order failed"));
  };

  // ---------------- Stripe card ----------------
  const stripeHandler = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return toast.error(
        "Stripe is not configured. Add STRIPE_API_KEY / STRIPE_SECRET_KEY, or use Cash on Delivery."
      );
    }
    try {
      const amount = Math.round(Number(orderData.totalPrice) * 100); // cents
      const { data } = await axios.post(`${server}/payment/process`, { amount });

      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: { card: elements.getElement(CardNumberElement) },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        await createOrder({
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
          type: "Credit Card",
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Payment failed — check your Stripe keys."
      );
    }
  };

  // ---------------- Cash on delivery ----------------
  const cashOnDelivery = (e) => {
    e.preventDefault();
    createOrder({ type: "Cash On Delivery", status: "succeeded" });
  };

  const stripeInput = "w-full border p-2 rounded-[3px] mt-2";

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        {/* Payment methods */}
        <div className="w-full 800px:w-[65%]">
          <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
            {/* Card */}
            <div>
              <div className="flex w-full pb-5 border-b mb-2">
                <div
                  className="relative flex items-center cursor-pointer"
                  onClick={() => setSelect(1)}
                >
                  <div className="w-[22px] h-[22px] rounded-full border-[3px] border-[#1d1a1ab4] flex items-center justify-center">
                    {select === 1 ? (
                      <div className="w-[12px] h-[12px] bg-[#1d1a1acb] rounded-full" />
                    ) : null}
                  </div>
                  <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
                    Pay with Debit/credit card
                  </h4>
                </div>
              </div>

              {select === 1 ? (
                <form className="w-full" onSubmit={stripeHandler}>
                  <div className="w-full block 800px:flex pb-3">
                    <div className="w-full 800px:w-[50%] 800px:pr-2">
                      <label className="block pb-2">Card Number</label>
                      <div className={stripeInput}>
                        <CardNumberElement
                          options={{ style: { base: { fontSize: "16px" } } }}
                        />
                      </div>
                    </div>
                    <div className="w-full 800px:w-[50%]">
                      <label className="block pb-2">Exp Date</label>
                      <div className={stripeInput}>
                        <CardExpiryElement
                          options={{ style: { base: { fontSize: "16px" } } }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full block 800px:flex pb-3">
                    <div className="w-full 800px:w-[50%]">
                      <label className="block pb-2">CVC</label>
                      <div className={stripeInput}>
                        <CardCvcElement
                          options={{ style: { base: { fontSize: "16px" } } }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    type="submit"
                    value="Submit"
                    className={`${styles.button} !bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
                  />
                  <p className="text-[12px] text-gray-400 mt-2">
                    Test mode — use card <b>4242 4242 4242 4242</b>, any future
                    expiry, any CVC.
                  </p>
                </form>
              ) : null}
            </div>

            <br />
            {/* Cash on delivery */}
            <div>
              <div className="flex w-full pb-5 border-b mb-2">
                <div
                  className="relative flex items-center cursor-pointer"
                  onClick={() => setSelect(2)}
                >
                  <div className="w-[22px] h-[22px] rounded-full border-[3px] border-[#1d1a1ab4] flex items-center justify-center">
                    {select === 2 ? (
                      <div className="w-[12px] h-[12px] bg-[#1d1a1acb] rounded-full" />
                    ) : null}
                  </div>
                  <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
                    Cash on Delivery
                  </h4>
                </div>
              </div>
              {select === 2 ? (
                <form onSubmit={cashOnDelivery}>
                  <input
                    type="submit"
                    value="Confirm Order"
                    className={`${styles.button} !bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
                  />
                </form>
              ) : null}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
            <div className="flex justify-between">
              <h3 className="text-[16px] font-[400] text-[#000000a4]">
                subtotal:
              </h3>
              <h5 className="text-[18px] font-[600]">
                ${orderData?.subTotalPrice?.toFixed(2) || "0.00"}
              </h5>
            </div>
            <br />
            <div className="flex justify-between">
              <h3 className="text-[16px] font-[400] text-[#000000a4]">
                shipping:
              </h3>
              <h5 className="text-[18px] font-[600]">
                {orderData?.shipping > 0
                  ? `$${orderData.shipping.toFixed(2)}`
                  : "-"}
              </h5>
            </div>
            <br />
            <div className="flex justify-between border-b pb-3">
              <h3 className="text-[16px] font-[400] text-[#000000a4]">
                Discount:
              </h3>
              <h5 className="text-[18px] font-[600]">
                {orderData?.discount > 0
                  ? `- $${orderData.discount.toFixed(2)}`
                  : "-"}
              </h5>
            </div>
            <h5 className="text-[18px] font-[600] text-end pt-3">
              ${orderData?.totalPrice || "0.00"}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  const { user } = useSelector((state) => state.user);
  const savedCards = user?.paymentMethods || [];

  const [orderData, setOrderData] = useState(null);
  const [select, setSelect] = useState(1); // 1 = card, 2 = COD, 3 = saved card
  const [selectedCardId, setSelectedCardId] = useState(null);
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

  // Preselect the buyer's default saved card ("fetch" its details on load)
  useEffect(() => {
    if (!savedCards.length) return;
    const def = savedCards.find((c) => c.isDefault) || savedCards[0];
    setSelectedCardId((prev) => prev || def?._id);
  }, [savedCards]);

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

  // ---------------- Saved card (default) ----------------
  const savedCardHandler = (e) => {
    e.preventDefault();
    const card = savedCards.find((c) => c._id === selectedCardId);
    if (!card) return toast.error("Please select a saved card");
    createOrder({
      type: "Saved Card",
      status: "succeeded",
      brand: card.brand,
      last4: card.last4,
      cardHolderName: card.cardHolderName,
    });
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
            {/* Saved card (default) */}
            <div>
              <div className="flex w-full pb-5 border-b mb-2">
                <div
                  className="relative flex items-center cursor-pointer"
                  onClick={() => setSelect(3)}
                >
                  <div className="w-[22px] h-[22px] rounded-full border-[3px] border-[#1d1a1ab4] flex items-center justify-center">
                    {select === 3 ? (
                      <div className="w-[12px] h-[12px] bg-[#1d1a1acb] rounded-full" />
                    ) : null}
                  </div>
                  <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
                    Pay with saved card
                  </h4>
                </div>
              </div>

              {select === 3 ? (
                savedCards.length ? (
                  <form onSubmit={savedCardHandler} className="w-full">
                    <div className="space-y-2 pb-3">
                      {savedCards.map((c) => (
                        <label
                          key={c._id}
                          className={`flex items-center justify-between border rounded-[5px] p-3 cursor-pointer ${
                            selectedCardId === c._id
                              ? "border-[#3321c8] bg-[#f5f4ff]"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="savedCard"
                              checked={selectedCardId === c._id}
                              onChange={() => setSelectedCardId(c._id)}
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-[600]">
                                  {c.brand} •••• {c.last4}
                                </span>
                                {c.isDefault ? (
                                  <span className="text-[11px] bg-[#3ad132] text-white px-2 py-[1px] rounded-full">
                                    Default
                                  </span>
                                ) : null}
                              </div>
                              <span className="text-[13px] text-gray-500">
                                {c.cardHolderName} · exp {c.expiryDate}
                              </span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                    <input
                      type="submit"
                      value="Confirm Order"
                      className={`${styles.button} !bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
                    />
                  </form>
                ) : (
                  <p className="text-[14px] text-gray-500">
                    No saved cards.{" "}
                    <Link to="/profile" className="text-[#3321c8] underline">
                      Add one in your dashboard
                    </Link>{" "}
                    (Payment Methods tab).
                  </p>
                )
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

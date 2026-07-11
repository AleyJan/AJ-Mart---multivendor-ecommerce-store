import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Payment from "../components/Payment/Payment";
import { server } from "../server";

const PaymentPage = () => {
  const [stripeApikey, setStripeApikey] = useState("pending");

  useEffect(() => {
    axios
      .get(`${server}/payment/stripeapikey`)
      .then((res) => setStripeApikey(res.data.stripeApikey || "none"))
      .catch(() => setStripeApikey("none"));
  }, []);

  // Only load Stripe.js for a real key; otherwise keep it null (Card disabled,
  // but Cash on Delivery still works).
  const stripePromise = useMemo(() => {
    if (stripeApikey && stripeApikey !== "pending" && !stripeApikey.includes("your_") && stripeApikey !== "none") {
      return loadStripe(stripeApikey);
    }
    return null;
  }, [stripeApikey]);

  return (
    <div>
      <Header />
      <div className="w-full bg-[#f5f5f5] min-h-screen">
        <CheckoutSteps active={2} />
        {stripeApikey === "pending" ? (
          <div className="w-full text-center py-16 text-gray-500">
            Loading payment...
          </div>
        ) : (
          <Elements stripe={stripePromise}>
            <Payment />
          </Elements>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;

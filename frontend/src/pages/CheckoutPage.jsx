import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Checkout from "../components/Checkout/Checkout";

const CheckoutPage = () => {
  return (
    <div>
      <Header />
      <div className="w-full bg-[#f5f5f5] min-h-screen">
        <CheckoutSteps active={1} />
        <Checkout />
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "../../styles/styles";
import { server } from "../../server";

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Pakistan",
  "India",
  "Germany",
  "France",
];
const cities = [
  "New York",
  "London",
  "Toronto",
  "Sydney",
  "Karachi",
  "Mumbai",
  "Berlin",
  "Paris",
];

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discountPrice, setDiscountPrice] = useState(0);

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );
  const shipping = 0; // free shipping
  const totalPrice = (subTotalPrice + shipping - discountPrice).toFixed(2);

  const paymentSubmit = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    if (!fullName || !email || !address1 || !zipCode || !country || !city) {
      toast.error("Please fill all the required shipping fields!");
      return;
    }
    const shippingAddress = {
      fullName,
      email,
      phoneNumber,
      zipCode,
      country,
      city,
      address1,
      address2,
    };
    const orderData = {
      cart,
      totalPrice,
      subTotalPrice,
      shipping,
      discount: discountPrice,
      shippingAddress,
      user,
    };
    localStorage.setItem("latestOrder", JSON.stringify(orderData));
    navigate("/payment");
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    const name = couponCode.trim();
    if (!name) return;

    await axios
      .get(`${server}/coupon/get-coupon-value/${name}`)
      .then((res) => {
        const coupon = res.data.couponCode;
        if (!coupon) {
          toast.error("Coupon code doesn't exist!");
          setCouponCode("");
          return;
        }
        // Coupon only applies to items from the shop that issued it.
        const eligible = cart.filter((i) => i.shopId === coupon.shopId);
        if (eligible.length === 0) {
          toast.error("This coupon is not valid for the items in your cart.");
          setCouponCode("");
          return;
        }
        const eligibleTotal = eligible.reduce(
          (a, i) => a + i.discountPrice * i.qty,
          0
        );
        setDiscountPrice((eligibleTotal * coupon.value) / 100);
        toast.success(`Coupon applied: ${coupon.value}% off eligible items!`);
      })
      .catch(() => {
        toast.error("Coupon code doesn't exist!");
        setCouponCode("");
      });
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        {/* Shipping address */}
        <div className="w-full 800px:w-[65%]">
          <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
            <h5 className="text-[18px] font-[500]">Shipping Address</h5>
            <br />
            <div className="w-full block 800px:flex pb-3">
              <div className="w-full 800px:w-[50%]">
                <label className="block pb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className={`${styles.input} !w-[95%]`}
                />
              </div>
              <div className="w-full 800px:w-[50%]">
                <label className="block pb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`${styles.input}`}
                />
              </div>
            </div>

            <div className="w-full block 800px:flex pb-3">
              <div className="w-full 800px:w-[50%]">
                <label className="block pb-2">Phone Number</label>
                <input
                  type="number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`${styles.input} !w-[95%]`}
                />
              </div>
              <div className="w-full 800px:w-[50%]">
                <label className="block pb-2">Zip Code</label>
                <input
                  type="number"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
                  className={`${styles.input}`}
                />
              </div>
            </div>

            <div className="w-full block 800px:flex pb-3">
              <div className="w-full 800px:w-[50%]">
                <label className="block pb-2">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-[95%] border h-[40px] rounded-[5px]"
                >
                  <option value="">Choose your country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full 800px:w-[50%]">
                <label className="block pb-2">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-[95%] border h-[40px] rounded-[5px]"
                >
                  <option value="">Choose your City</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full block 800px:flex pb-3">
              <div className="w-full 800px:w-[50%]">
                <label className="block pb-2">Address1</label>
                <input
                  type="text"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  required
                  className={`${styles.input} !w-[95%]`}
                />
              </div>
              <div className="w-full 800px:w-[50%]">
                <label className="block pb-2">Address2</label>
                <input
                  type="text"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  className={`${styles.input}`}
                />
              </div>
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
                ${subTotalPrice.toFixed(2)}
              </h5>
            </div>
            <br />
            <div className="flex justify-between">
              <h3 className="text-[16px] font-[400] text-[#000000a4]">
                shipping:
              </h3>
              <h5 className="text-[18px] font-[600]">
                {shipping > 0 ? `$${shipping.toFixed(2)}` : "-"}
              </h5>
            </div>
            <br />
            <div className="flex justify-between border-b pb-3">
              <h3 className="text-[16px] font-[400] text-[#000000a4]">
                Discount:
              </h3>
              <h5 className="text-[18px] font-[600]">
                {discountPrice > 0 ? `- $${discountPrice.toFixed(2)}` : "-"}
              </h5>
            </div>
            <h5 className="text-[18px] font-[600] text-end pt-3">
              ${totalPrice}
            </h5>
            <br />
            <form onSubmit={handleApplyCoupon}>
              <input
                type="text"
                className={`${styles.input} h-[40px] pl-2`}
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                required
              />
              <input
                className="w-full h-[40px] border border-[#f63b60] text-center text-[#f63b60] rounded-[3px] mt-8 cursor-pointer"
                required
                value="Apply code"
                type="submit"
              />
            </form>
          </div>
        </div>
      </div>

      <div
        className={`${styles.button} w-[150px] 800px:w-[280px] mt-10`}
        onClick={paymentSubmit}
      >
        <h5 className="text-white">Go to Payment</h5>
      </div>
    </div>
  );
};

export default Checkout;

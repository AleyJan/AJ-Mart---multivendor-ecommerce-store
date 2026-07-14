import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineDelete, AiOutlineCreditCard } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { loadUser } from "../../redux/actions/user";
import styles from "../../styles/styles";

const PaymentTab = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [makeDefault, setMakeDefault] = useState(false);

  const reset = () => {
    setCardHolderName("");
    setCardNumber("");
    setExpiryDate("");
    setMakeDefault(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const digits = cardNumber.replace(/\D/g, "");
    if (!cardHolderName || digits.length < 12 || !expiryDate) {
      return toast.error("Please enter valid card details");
    }
    try {
      await axios.put(
        `${server}/user/update-payment-methods`,
        { cardHolderName, cardNumber, expiryDate, makeDefault },
        { withCredentials: true }
      );
      toast.success("Payment method saved!");
      dispatch(loadUser());
      reset();
      setOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save card");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${server}/user/delete-payment-method/${id}`, {
        withCredentials: true,
      });
      toast.success("Card removed");
      dispatch(loadUser());
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete card");
    }
  };

  const setDefault = async (id) => {
    try {
      await axios.put(
        `${server}/user/set-default-payment/${id}`,
        {},
        { withCredentials: true }
      );
      dispatch(loadUser());
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update default");
    }
  };

  const cards = user?.paymentMethods || [];

  return (
    <div className="w-full px-2 800px:px-5">
      <div className="flex items-center justify-between pb-4">
        <h3 className="text-[22px] font-[500]">Payment Methods</h3>
        <button
          className={`${styles.button} !h-[40px] !rounded-[4px] text-white`}
          onClick={() => setOpen(true)}
        >
          Add New Card
        </button>
      </div>

      {cards.length ? (
        cards.map((c) => (
          <div
            key={c._id}
            className="w-full bg-white rounded shadow-sm flex items-center justify-between p-4 mb-3"
          >
            <div className="flex items-center gap-3">
              <AiOutlineCreditCard size={28} className="text-[#3321c8]" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-[600]">
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
            <div className="flex items-center gap-4">
              {!c.isDefault ? (
                <button
                  className="text-[13px] text-[#3321c8] underline"
                  onClick={() => setDefault(c._id)}
                >
                  Set default
                </button>
              ) : null}
              <AiOutlineDelete
                size={22}
                className="cursor-pointer text-red-600"
                title="Delete"
                onClick={() => handleDelete(c._id)}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="w-full flex items-center justify-center min-h-[25vh] text-gray-500">
          You have no saved payment methods.
        </div>
      )}

      <p className="text-[12px] text-gray-400 pt-2">
        For your security only the card brand, last 4 digits and expiry are
        stored — never the full number or CVV.
      </p>

      {/* Add-card modal */}
      {open ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#0000005f] z-50 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[50%] bg-white rounded shadow p-5 relative">
            <RxCross1
              size={26}
              className="absolute top-3 right-3 cursor-pointer"
              onClick={() => setOpen(false)}
            />
            <h4 className="text-[20px] font-[500] text-center pb-4">
              Add New Card
            </h4>
            <form onSubmit={handleSubmit}>
              <div className="pb-3">
                <label className="block pb-1">Name on Card</label>
                <input
                  type="text"
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className="pb-3">
                <label className="block pb-1">Card Number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className={styles.input}
                />
              </div>
              <div className="pb-3">
                <label className="block pb-1">Expiry (MM/YY)</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="08/27"
                  className={styles.input}
                />
              </div>
              <label className="flex items-center gap-2 pb-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={makeDefault}
                  onChange={(e) => setMakeDefault(e.target.checked)}
                />
                <span className="text-[14px]">Set as default card</span>
              </label>
              <input
                type="submit"
                value="Save Card"
                className={`${styles.button} w-full text-white !rounded-[4px] mt-2 cursor-pointer`}
              />
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PaymentTab;

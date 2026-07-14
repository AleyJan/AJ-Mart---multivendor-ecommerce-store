import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineCamera } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { imageUrl } from "../../utils/imageUrl";
import styles from "../../styles/styles";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import { loadUser } from "../../redux/actions/user";
import Inbox from "../Messaging/Inbox";
import AddressTab from "./AddressTab";
import PaymentTab from "./PaymentTab";

const ProfileContent = ({ active }) => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  // the buyer chats with sellers -> fetch shop info for each conversation
  const fetchOther = (sellerId) =>
    axios.get(`${server}/shop/get-shop-info/${sellerId}`).then((res) => ({
      name: res.data.shop?.name,
      avatar: res.data.shop?.avatar?.url
        ? imageUrl(res.data.shop.avatar.url)
        : null,
    }));

  useEffect(() => {
    if ((active === 2 || active === 3 || active === 5) && user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, active, user]);

  const requestRefund = async (id) => {
    await axios
      .put(
        `${server}/order/order-refund/${id}`,
        { status: "Processing refund" },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("Refund request sent!");
        dispatch(getAllOrdersOfUser(user._id));
      })
      .catch((e) => toast.error(e.response?.data?.message || "Failed"));
  };

  const refundOrders = (orders || []).filter(
    (o) => o.status === "Processing refund" || o.status === "Refund Success"
  );
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${server}/user/update-user-info`,
        { name, email, phoneNumber },
        { withCredentials: true }
      );
      toast.success("Profile updated!");
      dispatch(loadUser());
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append("image", file);
    try {
      await axios.put(`${server}/user/update-avatar`, form, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Avatar updated!");
      dispatch(loadUser());
    } catch (err) {
      toast.error(err.response?.data?.message || "Avatar update failed");
    }
  };

  return (
    <div className="w-full">
      {/* ---------------- Profile tab ---------------- */}
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              <img
                src={imageUrl(user?.avatar?.url)}
                className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
                alt=""
              />
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <label
                htmlFor="avatar-upload"
                className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]"
              >
                <AiOutlineCamera />
              </label>
            </div>
          </div>

          <div className="w-full px-5 mt-8">
            <form onSubmit={handleSubmit} aria-required={true}>
              <div className="w-full 800px:flex block pb-3">
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Full Name</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Email Address</label>
                  <input
                    type="email"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full 800px:flex block pb-3">
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Phone Number</label>
                  <input
                    type="number"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>

              <p className="text-[13px] text-gray-500 pb-1">
                Manage your saved addresses in the{" "}
                <span className="text-[#3321c8] font-[500]">Address</span> tab.
              </p>

              <input
                className="w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer"
                required
                value="Update"
                type="submit"
              />
            </form>
          </div>
        </>
      )}

      {/* ---------------- Orders tab ---------------- */}
      {active === 2 && (
        <div className="w-full px-2 800px:px-5">
          <h3 className="text-[22px] font-[500] pb-4">My Orders</h3>
          {orders && orders.length ? (
            <div className="overflow-x-auto bg-white rounded shadow-sm p-3">
              <table className="w-full text-left border-collapse min-w-[560px]">
                <thead>
                  <tr className="border-b text-[14px] text-gray-500">
                    <th className="py-2 pr-4">Order ID</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Items Qty</th>
                    <th className="py-2 pr-4">Total</th>
                    <th className="py-2 pr-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => {
                    const qty = o.cart.reduce((a, i) => a + i.qty, 0);
                    return (
                      <tr key={o._id} className="border-b text-[14px]">
                        <td className="py-3 pr-4">{o._id.slice(-8)}</td>
                        <td
                          className={`py-3 pr-4 ${
                            o.status === "Delivered"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {o.status}
                        </td>
                        <td className="py-3 pr-4">{qty}</td>
                        <td className="py-3 pr-4">US${o.totalPrice}</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/user/order/${o._id}`}
                              className="text-[#3321c8] underline"
                            >
                              View / Review
                            </Link>
                            <Link
                              to={`/user/track/order/${o._id}`}
                              className="text-[#3321c8] underline"
                            >
                              Track
                            </Link>
                            {o.status === "Delivered" ? (
                              <button
                                className="text-[#3321c8] underline"
                                onClick={() => requestRefund(o._id)}
                              >
                                Ask for Refund
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center min-h-[30vh] text-gray-500">
              You have no orders yet.
            </div>
          )}
        </div>
      )}

      {/* ---------------- Refunds tab ---------------- */}
      {active === 3 && (
        <div className="w-full px-2 800px:px-5">
          <h3 className="text-[22px] font-[500] pb-4">My Refunds</h3>
          {refundOrders.length ? (
            <div className="overflow-x-auto bg-white rounded shadow-sm p-3">
              <table className="w-full text-left border-collapse min-w-[480px]">
                <thead>
                  <tr className="border-b text-[14px] text-gray-500">
                    <th className="py-2 pr-4">Order ID</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {refundOrders.map((o) => (
                    <tr key={o._id} className="border-b text-[14px]">
                      <td className="py-3 pr-4">{o._id.slice(-8)}</td>
                      <td
                        className={`py-3 pr-4 ${
                          o.status === "Refund Success"
                            ? "text-green-600"
                            : "text-[#d97706]"
                        }`}
                      >
                        {o.status}
                      </td>
                      <td className="py-3 pr-4">US${o.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center min-h-[30vh] text-gray-500">
              You have no refunds.
            </div>
          )}
        </div>
      )}

      {/* ---------------- Inbox tab ---------------- */}
      {active === 4 && (
        <div className="w-full px-2 800px:px-5">
          <h3 className="text-[22px] font-[500] pb-4">Inbox</h3>
          {user?._id ? (
            <Inbox
              meId={user._id}
              conversationsUrl={`${server}/conversation/get-all-conversation-user/${user._id}`}
              fetchOther={fetchOther}
            />
          ) : null}
        </div>
      )}

      {/* ---------------- Payment Methods tab ---------------- */}
      {active === 6 && <PaymentTab />}

      {/* ---------------- Address tab ---------------- */}
      {active === 7 && <AddressTab />}

      {/* ---------------- Track Order tab ---------------- */}
      {active === 5 && (
        <div className="w-full px-2 800px:px-5">
          <h3 className="text-[22px] font-[500] pb-4">Track Order</h3>
          {orders && orders.length ? (
            <div className="overflow-x-auto bg-white rounded shadow-sm p-3">
              <table className="w-full text-left border-collapse min-w-[480px]">
                <thead>
                  <tr className="border-b text-[14px] text-gray-500">
                    <th className="py-2 pr-4">Order ID</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Total</th>
                    <th className="py-2 pr-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id} className="border-b text-[14px]">
                      <td className="py-3 pr-4">{o._id.slice(-8)}</td>
                      <td
                        className={`py-3 pr-4 ${
                          o.status === "Delivered"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {o.status}
                      </td>
                      <td className="py-3 pr-4">US${o.totalPrice}</td>
                      <td className="py-3 pr-4">
                        <Link
                          to={`/user/track/order/${o._id}`}
                          className="text-[#3321c8] underline"
                        >
                          Track
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center min-h-[30vh] text-gray-500">
              You have no orders to track.
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ProfileContent;

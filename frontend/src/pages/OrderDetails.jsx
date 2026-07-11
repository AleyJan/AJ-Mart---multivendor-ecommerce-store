import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { server } from "../server";

const OrderDetails = () => {
  const { id } = useParams();
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (user?._id) dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user]);

  const order = orders?.find((o) => o._id === id);

  const openReview = (item) => {
    setSelectedItem(item);
    setRating(1);
    setComment("");
    setOpen(true);
  };

  const submitReview = async () => {
    await axios
      .put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem.id,
          orderId: order._id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        setOpen(false);
        dispatch(getAllOrdersOfUser(user._id));
      })
      .catch((err) =>
        toast.error(err.response?.data?.message || "Could not submit review")
      );
  };

  if (!order) {
    return (
      <div>
        <Header />
        <p className="text-center py-20 text-gray-500">Loading order...</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className={`${styles.section} bg-[#f5f5f5] min-h-[70vh] py-10`}>
        <div className="w-full 800px:w-[80%] mx-auto bg-white rounded p-5">
          <div className="flex items-center justify-between border-b pb-3">
            <h1 className="text-[22px] font-[600]">Order Details</h1>
            <span
              className={`text-[15px] ${
                order.status === "Delivered"
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {order.status}
            </span>
          </div>
          <p className="text-gray-500 text-[14px] pt-2">
            Order ID: <b>#{order._id.slice(-8)}</b> &nbsp;|&nbsp; Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>

          {/* items */}
          <div className="mt-5">
            {order.cart.map((item, i) => (
              <div key={i} className="flex items-center border-b py-4">
                <img
                  src={item.image_Url?.[0]?.url}
                  alt=""
                  className="w-[70px] h-[70px] object-cover rounded"
                />
                <div className="pl-3 flex-1">
                  <h4 className="font-[500]">{item.name}</h4>
                  <p className="text-gray-500 text-[14px]">
                    US${item.discountPrice} x {item.qty}
                  </p>
                </div>
                {order.status === "Delivered" && item.shopId ? (
                  item.isReviewed ? (
                    <span className="text-green-600 text-[14px]">Reviewed</span>
                  ) : (
                    <button
                      onClick={() => openReview(item)}
                      className="bg-[#3321c8] text-white text-[14px] px-3 h-[36px] rounded"
                    >
                      Write a review
                    </button>
                  )
                ) : null}
              </div>
            ))}
          </div>

          <h4 className="text-right pt-4 font-[600] text-[18px]">
            Total: US${order.totalPrice}
          </h4>

          {/* shipping */}
          <div className="mt-6">
            <h5 className="font-[600] pb-1">Shipping Address</h5>
            <p className="text-gray-600 text-[14px]">
              {order.shippingAddress?.address1} {order.shippingAddress?.city}{" "}
              {order.shippingAddress?.country}
            </p>
            <p className="text-gray-600 text-[14px]">
              {order.shippingAddress?.fullName} · {order.shippingAddress?.phoneNumber}
            </p>
          </div>
        </div>
      </div>
      <Footer />

      {/* review modal */}
      {open && selectedItem ? (
        <div className="fixed inset-0 bg-[#00000030] z-50 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[40%] bg-white rounded p-4">
            <div className="flex justify-end">
              <RxCross1
                size={22}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h3 className="text-center text-[20px] font-[500]">
              Review: {selectedItem.name?.slice(0, 30)}
            </h3>

            <div className="flex items-center my-4">
              <span className="mr-2">Rating:</span>
              {[1, 2, 3, 4, 5].map((n) =>
                n <= rating ? (
                  <AiFillStar
                    key={n}
                    size={26}
                    className="text-[#f6b100] cursor-pointer"
                    onClick={() => setRating(n)}
                  />
                ) : (
                  <AiOutlineStar
                    key={n}
                    size={26}
                    className="text-[#f6b100] cursor-pointer"
                    onClick={() => setRating(n)}
                  />
                )
              )}
            </div>

            <textarea
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              className="w-full border rounded p-2 focus:outline-none"
            />

            <button
              onClick={submitReview}
              className="mt-3 w-full bg-[#3321c8] text-white h-[40px] rounded"
            >
              Submit Review
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default OrderDetails;

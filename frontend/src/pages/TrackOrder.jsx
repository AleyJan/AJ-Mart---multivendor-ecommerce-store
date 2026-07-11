import { Fragment, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";
import { getAllOrdersOfUser } from "../redux/actions/order";

const steps = ["Processing", "Shipping", "Delivered"];

const statusMessage = {
  Processing: "Your order is being processed by the seller.",
  Shipping: "Your order is on the way with the delivery partner.",
  Delivered: "Your order has been delivered. Enjoy your purchase!",
  "Processing refund": "Your refund request is being processed.",
  "Refund Success": "Your refund has been completed successfully.",
};

const TrackOrder = () => {
  const { id } = useParams();
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user]);

  const order = orders?.find((o) => o._id === id);

  if (!order) {
    return (
      <div>
        <Header />
        <p className="text-center py-20 text-gray-500">Loading order...</p>
      </div>
    );
  }

  const isRefund = /refund/i.test(order.status);
  const currentStep = steps.indexOf(order.status);

  return (
    <div>
      <Header />
      <div className={`${styles.section} bg-[#f5f5f5] min-h-[70vh] py-10`}>
        <div className="w-full 800px:w-[70%] mx-auto bg-white rounded p-6">
          <h1 className="text-[22px] font-[600] mb-1">Track Order</h1>
          <p className="text-gray-500 text-[14px] mb-8">
            Order #{order._id.slice(-8)}
          </p>

          {isRefund ? (
            <div className="text-center py-8">
              <h3
                className={`text-[20px] font-[600] ${
                  order.status === "Refund Success"
                    ? "text-green-600"
                    : "text-[#f6b100]"
                }`}
              >
                {order.status}
              </h3>
              <p className="text-gray-600 mt-2">{statusMessage[order.status]}</p>
            </div>
          ) : (
            <>
              <div className="flex items-center mb-8">
                {steps.map((s, i) => (
                  <Fragment key={s}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-[36px] h-[36px] rounded-full flex items-center justify-center text-white ${
                          i <= currentStep ? "bg-[#3321c8]" : "bg-gray-300"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <span
                        className={`mt-2 text-[12px] whitespace-nowrap ${
                          i <= currentStep
                            ? "text-[#3321c8] font-[500]"
                            : "text-gray-400"
                        }`}
                      >
                        {s}
                      </span>
                    </div>
                    {i < steps.length - 1 ? (
                      <div
                        className={`h-[3px] flex-1 mx-2 ${
                          i < currentStep ? "bg-[#3321c8]" : "bg-gray-300"
                        }`}
                      />
                    ) : null}
                  </Fragment>
                ))}
              </div>
              <p className="text-center text-gray-700">
                {statusMessage[order.status] || `Status: ${order.status}`}
              </p>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrackOrder;

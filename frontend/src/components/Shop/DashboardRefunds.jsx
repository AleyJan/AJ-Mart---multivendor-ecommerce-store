import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { server } from "../../server";

const DashboardRefunds = () => {
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch, seller]);

  const refundOrders = (orders || []).filter(
    (o) => o.status === "Processing refund" || o.status === "Refund Success"
  );

  const approve = async (id) => {
    await axios
      .put(
        `${server}/order/order-refund-success/${id}`,
        { status: "Refund Success" },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("Refund approved!");
        dispatch(getAllOrdersOfShop(seller._id));
      })
      .catch((e) => toast.error(e.response?.data?.message || "Failed"));
  };

  return (
    <div className="w-full p-4 800px:p-8">
      <h3 className="text-[22px] font-Poppins pb-4 font-[500]">Refunds</h3>

      {refundOrders.length ? (
        <div className="overflow-x-auto bg-white rounded shadow-sm p-3">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="border-b text-[14px] text-gray-500">
                <th className="py-2 pr-4">Order ID</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {refundOrders.map((o) => (
                <tr key={o._id} className="border-b text-[14px]">
                  <td className="py-3 pr-4">{o._id.slice(-8)}</td>
                  <td className="py-3 pr-4 text-[#d97706]">{o.status}</td>
                  <td className="py-3 pr-4">US${o.totalPrice}</td>
                  <td className="py-3 pr-4">
                    {o.status === "Processing refund" ? (
                      <button
                        className="bg-[#3321c8] text-white px-3 h-[30px] rounded"
                        onClick={() => approve(o._id)}
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="text-green-600">Approved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center min-h-[40vh] text-gray-500">
          No refund requests.
        </div>
      )}
    </div>
  );
};

export default DashboardRefunds;

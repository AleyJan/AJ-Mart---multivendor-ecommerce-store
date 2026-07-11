import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";

const AdminWithdraw = () => {
  const [withdraws, setWithdraws] = useState([]);

  const fetchWithdraws = () =>
    axios
      .get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      .then((r) => setWithdraws(r.data.withdraws || []))
      .catch(() => {});

  useEffect(() => {
    fetchWithdraws();
  }, []);

  const approve = async (w) => {
    await axios
      .put(
        `${server}/withdraw/update-withdraw-request/${w._id}`,
        { sellerId: w.seller?._id },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("Withdraw request approved!");
        fetchWithdraws();
      })
      .catch((e) => toast.error(e.response?.data?.message || "Approve failed"));
  };

  return (
    <div className="w-full p-4 800px:p-8">
      <h3 className="text-[22px] font-Poppins pb-4 font-[500]">
        Withdraw Requests
      </h3>
      <div className="overflow-x-auto bg-white rounded shadow-sm p-3">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b text-[14px] text-gray-500">
              <th className="py-2 pr-4">Shop</th>
              <th className="py-2 pr-4">Amount</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Requested</th>
              <th className="py-2 pr-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {withdraws.map((w) => (
              <tr key={w._id} className="border-b text-[14px]">
                <td className="py-3 pr-4">{w.seller?.name}</td>
                <td className="py-3 pr-4">${Number(w.amount).toFixed(2)}</td>
                <td
                  className={`py-3 pr-4 ${
                    w.status === "succeed"
                      ? "text-green-600"
                      : "text-[#d97706]"
                  }`}
                >
                  {w.status}
                </td>
                <td className="py-3 pr-4">
                  {new Date(w.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 pr-4">
                  {w.status === "succeed" ? (
                    <span className="text-green-600">Paid</span>
                  ) : (
                    <button
                      onClick={() => approve(w)}
                      className="bg-[#3321c8] text-white px-3 h-[32px] rounded"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {withdraws.length === 0 ? (
          <p className="text-gray-500 py-4">No withdraw requests.</p>
        ) : null}
      </div>
    </div>
  );
};

export default AdminWithdraw;

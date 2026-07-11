import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";
import { server } from "../../server";

const WithdrawMoney = () => {
  const { seller } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [withdraws, setWithdraws] = useState([]);

  const balance = seller?.availableBalance || 0;

  const fetchWithdraws = () => {
    if (!seller?._id) return;
    axios
      .get(`${server}/withdraw/get-all-withdraw-request-seller/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => setWithdraws(res.data.withdraws || []))
      .catch(() => {});
  };

  useEffect(fetchWithdraws, [seller]);

  const withdrawHandler = async () => {
    if (Number(amount) < 10) {
      return toast.error("Minimum withdraw amount is $10");
    }
    await axios
      .post(
        `${server}/withdraw/create-withdraw-request`,
        { amount },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("Withdraw request sent successfully!");
        setOpen(false);
        setAmount("");
        window.location.reload();
      })
      .catch((err) => toast.error(err.response?.data?.message || "Failed"));
  };

  return (
    <div className="w-full p-4 800px:p-8">
      <div className="w-full bg-white shadow rounded p-6 mb-6">
        <h3 className="text-[18px] text-[#00000085] font-[400]">
          Available Balance
        </h3>
        <h2 className="text-[30px] font-[600] pt-2">${balance.toFixed(2)}</h2>
        <div
          className="mt-4 inline-block bg-[#3321c8] text-white px-5 h-[40px] rounded-[5px] flex items-center justify-center w-[160px] cursor-pointer"
          onClick={() => setOpen(true)}
        >
          Withdraw Money
        </div>
        <p className="text-[12px] text-gray-400 pt-3">
          Balance grows as your delivered orders are completed (minus a 10%
          service charge).
        </p>
      </div>

      <h3 className="text-[20px] font-[500] pb-3">Withdraw Requests</h3>
      {withdraws.length ? (
        <div className="overflow-x-auto bg-white rounded shadow-sm p-3">
          <table className="w-full text-left border-collapse min-w-[400px]">
            <thead>
              <tr className="border-b text-[14px] text-gray-500">
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Requested</th>
              </tr>
            </thead>
            <tbody>
              {withdraws.map((w) => (
                <tr key={w._id} className="border-b text-[14px]">
                  <td className="py-3 pr-4">${w.amount}</td>
                  <td className="py-3 pr-4 text-[#d97706]">{w.status}</td>
                  <td className="py-3 pr-4">
                    {new Date(w.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No withdraw requests yet.</p>
      )}

      {open ? (
        <div className="fixed top-0 left-0 w-full h-screen bg-[#00000030] z-[2000] flex items-center justify-center">
          <div className="w-[90%] 800px:w-[40%] bg-white rounded-md shadow p-5">
            <div className="w-full flex justify-end">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h3 className="text-[20px] font-Poppins text-center pb-4">
              Withdraw Money
            </h3>
            <input
              type="number"
              placeholder="Amount to withdraw..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border p-2 rounded-[5px] mb-4"
            />
            <div
              className="bg-[#3321c8] text-white h-[42px] rounded-[5px] flex items-center justify-center cursor-pointer"
              onClick={withdrawHandler}
            >
              Confirm Withdraw
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WithdrawMoney;

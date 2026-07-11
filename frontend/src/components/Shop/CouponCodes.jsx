import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { server } from "../../server";

const CouponCodes = () => {
  const { seller } = useSelector((state) => state.seller);
  const [coupons, setCoupons] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const fetchCoupons = () => {
    if (!seller?._id) return;
    axios
      .get(`${server}/coupon/get-coupon/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => setCoupons(res.data.couponCodes || []))
      .catch(() => {});
  };

  useEffect(fetchCoupons, [seller]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(
        `${server}/coupon/create-coupon-code`,
        { name, value, minAmount, maxAmount, shopId: seller._id },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("Coupon code created successfully!");
        setOpen(false);
        setName("");
        setValue("");
        setMinAmount("");
        setMaxAmount("");
        fetchCoupons();
      })
      .catch((err) => toast.error(err.response?.data?.message || "Failed"));
  };

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/coupon/delete-coupon/${id}`, { withCredentials: true })
      .then(() => {
        toast.success("Coupon code deleted!");
        fetchCoupons();
      })
      .catch(() => toast.error("Delete failed"));
  };

  const input =
    "mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  return (
    <div className="w-full p-4 800px:p-8">
      <div className="flex items-center justify-between pb-4">
        <h3 className="text-[22px] font-Poppins font-[500]">Discount Codes</h3>
        <div
          className="bg-[#3321c8] text-white px-4 h-[40px] rounded-[5px] flex items-center cursor-pointer"
          onClick={() => setOpen(true)}
        >
          Create Coupon Code
        </div>
      </div>

      {coupons.length ? (
        <div className="overflow-x-auto bg-white rounded shadow-sm p-3">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b text-[14px] text-gray-500">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Value</th>
                <th className="py-2 pr-4">Delete</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} className="border-b text-[14px]">
                  <td className="py-3 pr-4">{c.name}</td>
                  <td className="py-3 pr-4">{c.value} %</td>
                  <td className="py-3 pr-4">
                    <AiOutlineDelete
                      size={20}
                      className="cursor-pointer text-red-600"
                      onClick={() => handleDelete(c._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center min-h-[30vh] text-gray-500">
          No coupon codes yet.
        </div>
      )}

      {/* Create modal */}
      {open ? (
        <div className="fixed top-0 left-0 w-full h-screen bg-[#00000030] z-[2000] flex items-center justify-center">
          <div className="w-[90%] 800px:w-[40%] bg-white rounded-md shadow p-4">
            <div className="w-full flex justify-end">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h5 className="text-[22px] font-Poppins text-center">
              Create Coupon Code
            </h5>
            <form onSubmit={handleSubmit}>
              <br />
              <div>
                <label className="pb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  className={input}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter coupon code name..."
                  required
                />
              </div>
              <br />
              <div>
                <label className="pb-2">
                  Discount Percentage <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={value}
                  className={input}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter discount percentage..."
                  required
                />
              </div>
              <br />
              <div>
                <label className="pb-2">Min Amount</label>
                <input
                  type="number"
                  value={minAmount}
                  className={input}
                  onChange={(e) => setMinAmount(e.target.value)}
                  placeholder="Enter minimum amount..."
                />
              </div>
              <br />
              <div>
                <label className="pb-2">Max Amount</label>
                <input
                  type="number"
                  value={maxAmount}
                  className={input}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  placeholder="Enter maximum amount..."
                />
              </div>
              <br />
              <input
                type="submit"
                value="Create"
                className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] text-white bg-[#3321c8] hover:bg-blue-700 sm:text-sm"
              />
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CouponCodes;

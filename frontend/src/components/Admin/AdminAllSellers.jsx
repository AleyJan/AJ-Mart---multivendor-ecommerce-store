import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineDelete } from "react-icons/ai";
import { server } from "../../server";

const AdminAllSellers = () => {
  const [sellers, setSellers] = useState([]);

  const fetchSellers = () =>
    axios
      .get(`${server}/shop/admin-all-sellers`, { withCredentials: true })
      .then((r) => setSellers(r.data.sellers || []))
      .catch(() => {});

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/shop/delete-seller/${id}`, { withCredentials: true })
      .then(() => {
        toast.success("Seller deleted successfully!");
        fetchSellers();
      })
      .catch((e) => toast.error(e.response?.data?.message || "Delete failed"));
  };

  return (
    <div className="w-full p-4 800px:p-8">
      <h3 className="text-[22px] font-Poppins pb-4 font-[500]">All Sellers</h3>
      <div className="overflow-x-auto bg-white rounded shadow-sm p-3">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b text-[14px] text-gray-500">
              <th className="py-2 pr-4">Shop Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Address</th>
              <th className="py-2 pr-4">Balance</th>
              <th className="py-2 pr-4">Shop</th>
              <th className="py-2 pr-4">Delete</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((s) => (
              <tr key={s._id} className="border-b text-[14px]">
                <td className="py-3 pr-4">{s.name}</td>
                <td className="py-3 pr-4">{s.email}</td>
                <td className="py-3 pr-4">{s.address}</td>
                <td className="py-3 pr-4">
                  ${(s.availableBalance || 0).toFixed(2)}
                </td>
                <td className="py-3 pr-4">
                  <Link
                    to={`/shop/preview/${encodeURIComponent(s.name)}`}
                    className="text-[#3321c8] underline"
                  >
                    Preview
                  </Link>
                </td>
                <td className="py-3 pr-4">
                  <AiOutlineDelete
                    size={20}
                    className="cursor-pointer text-red-600"
                    onClick={() => handleDelete(s._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAllSellers;

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineDelete } from "react-icons/ai";
import { server } from "../../server";

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);

  const fetchSubscribers = () =>
    axios
      .get(`${server}/subscriber/admin-subscribers`, { withCredentials: true })
      .then((r) => setSubscribers(r.data.subscribers || []))
      .catch(() => {});

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/subscriber/admin-delete/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        toast.success("Subscriber removed");
        fetchSubscribers();
      })
      .catch((e) => toast.error(e.response?.data?.message || "Delete failed"));
  };

  return (
    <div className="w-full p-4 800px:p-8">
      <h3 className="text-[22px] font-Poppins pb-4 font-[500]">
        Subscribed Emails ({subscribers.length})
      </h3>
      {subscribers.length ? (
        <div className="overflow-x-auto bg-white rounded shadow-sm p-3">
          <table className="w-full text-left border-collapse min-w-[480px]">
            <thead>
              <tr className="border-b text-[14px] text-gray-500">
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Subscribed On</th>
                <th className="py-2 pr-4">Remove</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s._id} className="border-b text-[14px]">
                  <td className="py-3 pr-4">{s.email}</td>
                  <td className="py-3 pr-4">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4">
                    <AiOutlineDelete
                      size={20}
                      className="cursor-pointer text-red-600"
                      title="Remove subscriber"
                      onClick={() => handleDelete(s._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center min-h-[30vh] text-gray-500">
          No subscribers yet.
        </div>
      )}
    </div>
  );
};

export default AdminSubscribers;

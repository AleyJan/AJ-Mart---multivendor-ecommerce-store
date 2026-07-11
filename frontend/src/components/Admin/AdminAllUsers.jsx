import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineDelete } from "react-icons/ai";
import { server } from "../../server";

const AdminAllUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = () =>
    axios
      .get(`${server}/user/admin-all-users`, { withCredentials: true })
      .then((r) => setUsers(r.data.users || []))
      .catch(() => {});

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/user/delete-user/${id}`, { withCredentials: true })
      .then(() => {
        toast.success("User deleted successfully!");
        fetchUsers();
      })
      .catch((e) => toast.error(e.response?.data?.message || "Delete failed"));
  };

  return (
    <div className="w-full p-4 800px:p-8">
      <h3 className="text-[22px] font-Poppins pb-4 font-[500]">All Users</h3>
      <div className="overflow-x-auto bg-white rounded shadow-sm p-3">
        <table className="w-full text-left border-collapse min-w-[560px]">
          <thead>
            <tr className="border-b text-[14px] text-gray-500">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Joined</th>
              <th className="py-2 pr-4">Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b text-[14px]">
                <td className="py-3 pr-4">{u.name}</td>
                <td className="py-3 pr-4">{u.email}</td>
                <td className="py-3 pr-4">{u.role}</td>
                <td className="py-3 pr-4">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 pr-4">
                  <AiOutlineDelete
                    size={20}
                    className="cursor-pointer text-red-600"
                    onClick={() => handleDelete(u._id)}
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

export default AdminAllUsers;

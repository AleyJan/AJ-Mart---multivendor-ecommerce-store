import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../server";

const ResetPasswordPage = () => {
  const { type, token } = useParams(); // type: "user" | "shop"
  const navigate = useNavigate();
  const isShop = type === "shop";
  const loginPath = isShop ? "/shop-login" : "/login";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    if (password !== confirm) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${server}/${type}/reset-password/${token}`,
        { password }
      );
      toast.success(data.message || "Password reset!");
      navigate(loginPath);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Set a new password
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={submit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={visible ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  type={visible ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[40px] flex justify-center items-center rounded-md text-white bg-primary hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset password"}
            </button>
            <div className="text-sm text-center">
              <Link to={loginPath} className="text-primary hover:underline">
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

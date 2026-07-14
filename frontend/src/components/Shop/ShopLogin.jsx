import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";

const ShopLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(
        `${server}/shop/login-shop`,
        { email, password },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Login Successful!");
        navigate("/dashboard");
        window.location.reload(true);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Login failed");
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Login to your Shop
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Manage your products, orders and events
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
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
              <button
                type="submit"
                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700"
              >
                Submit
              </button>
            </div>

            <div className="text-sm text-right">
              <Link
                to="/shop/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="flex items-center w-full text-sm">
              <span>Don&apos;t have a shop?</span>
              <Link
                to="/shop-create"
                className="text-primary pl-2 hover:underline"
              >
                Create Shop
              </Link>
            </div>

            <div className="flex items-center justify-center w-full text-sm pt-3 border-t mt-2">
              <span className="text-gray-500">Are you a buyer?</span>
              <Link
                to="/login"
                className="text-[#f0a500] pl-2 font-[600] hover:underline"
              >
                Login as Buyer
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopLogin;

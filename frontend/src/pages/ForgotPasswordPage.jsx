import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../server";

// type: "user" (buyer) | "shop" (seller)
const ForgotPasswordPage = ({ type = "user" }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const isShop = type === "shop";
  const loginPath = isShop ? "/shop-login" : "/login";

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${server}/${type}/forgot-password`, {
        email,
      });
      toast.success(data.message || "Reset link sent!");
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Forgot Password{isShop ? " (Shop)" : ""}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          We&apos;ll email you a link to reset it
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {sent ? (
            <div className="text-center">
              <p className="text-gray-700 pb-4">
                If an account exists for <b>{email}</b>, a reset link is on its
                way. The link expires in 15 minutes.
              </p>
              <Link to={loginPath} className="text-primary hover:underline">
                Back to login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={submit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[40px] flex justify-center items-center rounded-md text-white bg-primary hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
              <div className="text-sm text-center">
                <Link to={loginPath} className="text-primary hover:underline">
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

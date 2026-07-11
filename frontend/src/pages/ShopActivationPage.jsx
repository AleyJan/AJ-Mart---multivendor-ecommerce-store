import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { server } from "../server";

const ShopActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const activationEmail = async () => {
        try {
          await axios.post(`${server}/shop/activation`, {
            activation_token,
          });
          setSuccess(true);
        } catch (err) {
          setError(true);
        }
      };
      activationEmail();
    }
  }, [activation_token]);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-50">
      {error ? (
        <p className="text-red-600 text-lg">
          Your token is expired or invalid!
        </p>
      ) : success ? (
        <div className="text-center">
          <p className="text-green-600 text-lg mb-3">
            Your shop has been created successfully!
          </p>
          <Link to="/shop-login" className="text-primary hover:underline">
            Go to Shop Login
          </Link>
        </div>
      ) : (
        <p className="text-gray-600 text-lg">Activating your shop...</p>
      )}
    </div>
  );
};

export default ShopActivationPage;

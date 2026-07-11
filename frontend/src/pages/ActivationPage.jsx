import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { server } from "../server";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const activationEmail = async () => {
        try {
          await axios.post(`${server}/user/activation`, {
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
            Your account has been created successfully!
          </p>
          <Link to="/login" className="text-primary hover:underline">
            Go to Login
          </Link>
        </div>
      ) : (
        <p className="text-gray-600 text-lg">Activating your account...</p>
      )}
    </div>
  );
};

export default ActivationPage;

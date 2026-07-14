import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { server } from "../server";

const UnsubscribePage = () => {
  const [params] = useSearchParams();
  const email = params.get("email") || "";
  const [status, setStatus] = useState("working"); // working | done | error

  useEffect(() => {
    if (!email) {
      setStatus("error");
      return;
    }
    axios
      .put(`${server}/subscriber/unsubscribe`, { email })
      .then(() => setStatus("done"))
      .catch(() => setStatus("error"));
  }, [email]);

  return (
    <div>
      <Header />
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        {status === "working" ? (
          <p className="text-gray-500 text-[18px]">Unsubscribing...</p>
        ) : null}

        {status === "done" ? (
          <>
            <h2 className="text-[26px] font-[600] pb-2">
              You&apos;ve been unsubscribed
            </h2>
            <p className="text-gray-600 pb-6">
              {email} will no longer receive our event emails.
            </p>
            <Link
              to="/"
              className="px-6 h-[42px] flex items-center bg-[#3321c8] text-white rounded-[4px]"
            >
              Back to home
            </Link>
          </>
        ) : null}

        {status === "error" ? (
          <>
            <h2 className="text-[26px] font-[600] pb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 pb-6">
              We couldn&apos;t process the unsubscribe. The link may be invalid
              or expired.
            </p>
            <Link
              to="/"
              className="px-6 h-[42px] flex items-center bg-[#3321c8] text-white rounded-[4px]"
            >
              Back to home
            </Link>
          </>
        ) : null}
      </div>
      <Footer />
    </div>
  );
};

export default UnsubscribePage;

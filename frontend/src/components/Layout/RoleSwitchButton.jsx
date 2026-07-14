import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import { server } from "../../server";

// Fiverr-style role switch. Routing is keyed to the CURRENTLY logged-in
// person's own email so a stale/other session can never leak the wrong
// dashboard:
//   toSeller: already the matching seller -> /dashboard; else a shop exists for
//     the buyer's email -> /shop-login (authenticate); else -> /shop-create.
//   toBuyer:  already the matching buyer  -> /; else a user exists for the
//     seller's email -> /login; else -> /sign-up.
const RoleSwitchButton = ({ direction, className, onNavigate }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller, seller } = useSelector((state) => state.seller);

  const go = (path) => {
    if (onNavigate) onNavigate();
    navigate(path);
  };

  const handleToSeller = async () => {
    // only trust the seller session when it belongs to this same person
    if (isSeller && seller?.email && seller.email === user?.email) {
      return go("/dashboard");
    }
    const email = user?.email;
    if (!email) return go("/shop-login"); // not a logged-in buyer
    try {
      const { data } = await axios.get(`${server}/shop/exists`, {
        params: { email },
      });
      go(data.exists ? "/shop-login" : "/shop-create");
    } catch {
      go("/shop-login");
    }
  };

  const handleToBuyer = async () => {
    if (isAuthenticated && user?.email && user.email === seller?.email) {
      return go("/");
    }
    const email = seller?.email;
    if (!email) return go("/login"); // not a logged-in seller
    try {
      const { data } = await axios.get(`${server}/user/exists`, {
        params: { email },
      });
      go(data.exists ? "/login" : "/sign-up");
    } catch {
      go("/login");
    }
  };

  const isToSeller = direction === "toSeller";
  const label = isToSeller ? "Go to Seller Dashboard" : "Go to Buyer Dashboard";
  const onClick = isToSeller ? handleToSeller : handleToBuyer;

  return (
    <button type="button" onClick={onClick} className={className}>
      <span className="flex items-center">
        {label} <IoIosArrowForward className="ml-1" />
      </span>
    </button>
  );
};

export default RoleSwitchButton;

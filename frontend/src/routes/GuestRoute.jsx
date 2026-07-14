import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useSellerAccess } from "./useSessions";

// Guards the auth pages (login / signup) so an already-authenticated visitor is
// bounced to where they belong instead of seeing a login form again.
// Buyer and seller sessions are independent: a logged-in buyer may still open
// the seller login, and vice versa. For the seller pages we only bounce when the
// seller session is *trusted* (not shadowing a different person's buyer session),
// so a mismatched session can still reach the login form to re-authenticate.
const GuestRoute = ({ type = "user", children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.user);
  const sellerAccess = useSellerAccess();

  if (type === "seller") {
    if (sellerAccess.resolving) return null; // wait for sessions to resolve
    return sellerAccess.valid ? <Navigate to="/dashboard" replace /> : children;
  }

  if (loading) return null; // wait for loadUser to resolve
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export default GuestRoute;

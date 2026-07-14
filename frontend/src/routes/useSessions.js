import { useSelector } from "react-redux";

// A seller session may drive the seller dashboard only when it isn't shadowing a
// *different* person's buyer session. If a buyer is logged in, the seller's email
// must match the buyer's; otherwise the seller session is not trusted and the
// person must (re)authenticate as the matching seller.
//   - pure seller (no buyer logged in)      -> valid
//   - buyer + seller with the same email    -> valid
//   - buyer + seller with different emails  -> NOT valid (force login)
//   - not a seller at all                   -> NOT valid
export const useSellerAccess = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);
  const { isSeller, seller, isLoading } = useSelector((state) => state.seller);

  const resolving = loading || isLoading;
  const emailsMatch =
    !isAuthenticated || !user?.email || seller?.email === user.email;
  const valid = Boolean(isSeller && emailsMatch);

  return { valid, resolving };
};

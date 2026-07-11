import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { RxPerson } from "react-icons/rx";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { AiOutlineLogin, AiOutlineMessage, AiOutlineCreditCard } from "react-icons/ai";
import { MdOutlineTrackChanges } from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { server } from "../../server";
import { clearCart } from "../../redux/actions/cart";
import { clearWishlist } from "../../redux/actions/wishlist";

const ProfileSidebar = ({ active, setActive }) => {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        // Clear this user's cart & wishlist so the next user starts fresh
        dispatch(clearCart());
        dispatch(clearWishlist());
        toast.success(res.data.message);
        window.location.reload(true);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Logout failed");
      });
  };

  const items = [
    { id: 1, title: "Profile", Icon: RxPerson },
    { id: 2, title: "Orders", Icon: HiOutlineShoppingBag },
    { id: 3, title: "Refunds", Icon: HiOutlineReceiptRefund },
    { id: 4, title: "Inbox", Icon: AiOutlineMessage },
    { id: 5, title: "Track Order", Icon: MdOutlineTrackChanges },
    { id: 6, title: "Payment Methods", Icon: AiOutlineCreditCard },
    { id: 7, title: "Address", Icon: TbAddressBook },
  ];

  return (
    <div className="w-full bg-white shadow-sm rounded-[10px] p-4 pt-8">
      {items.map(({ id, title, Icon }) => (
        <div
          key={id}
          className="flex items-center cursor-pointer w-full mb-8"
          onClick={() => setActive(id)}
        >
          <Icon size={20} color={active === id ? "red" : ""} />
          <span
            className={`pl-3 ${
              active === id ? "text-[red]" : ""
            } 800px:block hidden`}
          >
            {title}
          </span>
        </div>
      ))}

      <div
        className="single_item flex items-center cursor-pointer w-full mb-8"
        onClick={logoutHandler}
      >
        <AiOutlineLogin size={20} color={active === 8 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active === 8 ? "text-[red]" : ""
          } 800px:block hidden`}
        >
          Log out
        </span>
      </div>
    </div>
  );
};

export default ProfileSidebar;

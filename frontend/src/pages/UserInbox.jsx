import { useSelector } from "react-redux";
import axios from "axios";
import Header from "../components/Layout/Header";
import Inbox from "../components/Messaging/Inbox";
import styles from "../styles/styles";
import { server, backend_url } from "../server";

const UserInbox = () => {
  const { user } = useSelector((state) => state.user);

  // the buyer chats with sellers → fetch shop info
  const fetchOther = (sellerId) =>
    axios.get(`${server}/shop/get-shop-info/${sellerId}`).then((res) => ({
      name: res.data.shop?.name,
      avatar: res.data.shop?.avatar?.url
        ? `${backend_url}${res.data.shop.avatar.url}`
        : null,
    }));

  return (
    <div>
      <Header />
      <div className={`${styles.section} py-8`}>
        {user?._id ? (
          <Inbox
            meId={user._id}
            conversationsUrl={`${server}/conversation/get-all-conversation-user/${user._id}`}
            fetchOther={fetchOther}
          />
        ) : (
          <p className="text-center py-10 text-gray-500">
            Please login to view your messages.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserInbox;

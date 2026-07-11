import { useSelector } from "react-redux";
import axios from "axios";
import Inbox from "../Messaging/Inbox";
import { server, backend_url } from "../../server";

const DashboardMessages = () => {
  const { seller } = useSelector((state) => state.seller);

  // the seller chats with buyers → fetch user info
  const fetchOther = (userId) =>
    axios.get(`${server}/user/user-info/${userId}`).then((res) => ({
      name: res.data.user?.name,
      avatar: res.data.user?.avatar?.url
        ? `${backend_url}${res.data.user.avatar.url}`
        : null,
    }));

  return (
    <div className="w-full p-4 800px:p-8">
      <h3 className="text-[22px] font-Poppins pb-4 font-[500]">Shop Inbox</h3>
      {seller?._id ? (
        <Inbox
          meId={seller._id}
          conversationsUrl={`${server}/conversation/get-all-conversation-seller/${seller._id}`}
          fetchOther={fetchOther}
        />
      ) : null}
    </div>
  );
};

export default DashboardMessages;

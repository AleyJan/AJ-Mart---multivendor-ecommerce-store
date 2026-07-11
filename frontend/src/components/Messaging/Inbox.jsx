import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { server, socket_server } from "../../server";

// One conversation row in the left list; fetches the other party's name/avatar.
const ConversationItem = ({ conv, meId, active, onOpen, fetchOther }) => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const otherId = conv.members.find((m) => m !== meId);
    if (otherId) fetchOther(otherId).then(setInfo).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conv, meId]);

  return (
    <div
      onClick={() => onOpen(conv)}
      className={`flex items-center p-3 cursor-pointer border-b ${
        active ? "bg-gray-100" : ""
      }`}
    >
      <img
        src={info?.avatar || "https://cdn.simpleicons.org/shopify"}
        alt=""
        className="w-[45px] h-[45px] rounded-full object-cover"
      />
      <div className="pl-2 overflow-hidden">
        <h4 className="font-[500] truncate">{info?.name || "Loading..."}</h4>
        <p className="text-[13px] text-gray-500 truncate">
          {conv.lastMessage || "Start the conversation"}
        </p>
      </div>
    </div>
  );
};

// Reusable inbox — used by both the buyer (/inbox) and seller (dashboard).
const Inbox = ({ meId, conversationsUrl, fetchOther }) => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [otherInfo, setOtherInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  // connect socket once
  useEffect(() => {
    const s = io(socket_server, { transports: ["websocket"] });
    socketRef.current = s;
    s.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
    return () => s.disconnect();
  }, []);

  // register myself as online
  useEffect(() => {
    if (meId && socketRef.current) socketRef.current.emit("addUser", meId);
  }, [meId]);

  // append a real-time message if it belongs to the open chat
  useEffect(() => {
    if (
      arrivalMessage &&
      currentChat?.members?.includes(arrivalMessage.sender)
    ) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  // load conversations
  useEffect(() => {
    if (!meId) return;
    axios
      .get(conversationsUrl, { withCredentials: true })
      .then((res) => setConversations(res.data.conversations || []))
      .catch(() => {});
  }, [meId, conversationsUrl]);

  // auto-scroll to newest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openChat = async (conv) => {
    setCurrentChat(conv);
    const otherId = conv.members.find((m) => m !== meId);
    fetchOther(otherId).then(setOtherInfo).catch(() => setOtherInfo(null));
    axios
      .get(`${server}/message/get-all-messages/${conv._id}`)
      .then((res) => setMessages(res.data.messages || []))
      .catch(() => setMessages([]));
  };

  const sendHandler = async (e) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text || !currentChat) return;

    const receiverId = currentChat.members.find((m) => m !== meId);
    socketRef.current.emit("sendMessage", {
      senderId: meId,
      receiverId,
      text,
    });

    await axios
      .post(`${server}/message/create-new-message`, {
        sender: meId,
        text,
        conversationId: currentChat._id,
      })
      .then(async (res) => {
        setMessages((prev) => [...prev, res.data.message]);
        setNewMessage("");
        await axios.put(
          `${server}/conversation/update-last-message/${currentChat._id}`,
          { lastMessage: text, lastMessageId: meId }
        );
      })
      .catch(() => {});
  };

  return (
    <div className="w-full flex h-[80vh] bg-white rounded shadow-sm overflow-hidden">
      {/* conversations list */}
      <div className="w-[35%] 800px:w-[30%] border-r overflow-y-auto">
        <h3 className="p-3 text-[18px] font-[500] border-b">Messages</h3>
        {conversations.length ? (
          conversations.map((conv) => (
            <ConversationItem
              key={conv._id}
              conv={conv}
              meId={meId}
              active={currentChat?._id === conv._id}
              onOpen={openChat}
              fetchOther={fetchOther}
            />
          ))
        ) : (
          <p className="p-3 text-gray-500 text-[14px]">No conversations yet.</p>
        )}
      </div>

      {/* chat window */}
      <div className="w-[65%] 800px:w-[70%] flex flex-col">
        {currentChat ? (
          <>
            <div className="flex items-center p-3 border-b">
              <img
                src={otherInfo?.avatar || "https://cdn.simpleicons.org/shopify"}
                alt=""
                className="w-[40px] h-[40px] rounded-full object-cover"
              />
              <h4 className="pl-2 font-[500]">{otherInfo?.name || ""}</h4>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {messages.map((m, i) => {
                const mine = m.sender === meId;
                return (
                  <div
                    key={i}
                    ref={i === messages.length - 1 ? scrollRef : null}
                    className={`flex ${mine ? "justify-end" : "justify-start"} mb-2`}
                  >
                    <div
                      className={`max-w-[70%] px-3 py-2 rounded-lg text-[14px] ${
                        mine ? "bg-[#3321c8] text-white" : "bg-gray-200 text-black"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={sendHandler} className="flex items-center p-3 border-t">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-full px-4 h-[40px] focus:outline-none"
              />
              <button
                type="submit"
                className="ml-2 w-[40px] h-[40px] rounded-full bg-[#3321c8] text-white flex items-center justify-center"
              >
                <AiOutlineSend size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <AiOutlineArrowRight size={30} className="rotate-180 mb-2" />
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;

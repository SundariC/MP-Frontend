import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react"; // Video, ShieldCheck removed as unused
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

// 1. FIXED: Added transports to fix repeated connection errors
const socket = io("https://mp-backend-1-82km.onrender.com", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const ChatPage = () => {
  const { bookingId } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  // 2. FIXED: Removed duplicate useEffect and handled join_room logic
  useEffect(() => {
    if (bookingId && token) {
      socket.emit("join_room", bookingId);
      fetchChatHistory();
    }

    socket.on("receive_message", (data) => {
      // Logic to prevent duplicate messages if sender is same
      if (data.bookingId === bookingId) {
        setMessages((prev) => {
          // Check if message already exists to avoid double rendering
          const exists = prev.find(
            (m) => m.timestamp === data.timestamp && m.text === data.text
          );
          return exists ? prev : [...prev, data];
        });
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [bookingId, token]);

  const fetchChatHistory = async () => {
    try {
      const res = await axios.get(
        `https://mp-backend-1-82km.onrender.com/api/messages/${bookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Chat history load error", err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?._id || user?.id || storedUser?._id || storedUser?.id;
    const userRole = user?.role || storedUser?.role;

    const messageData = {
      bookingId: bookingId,
      sender: userId,
      text: newMessage,
      role: userRole,
      timestamp: new Date().toISOString(),
    };

    console.log("Final attempt data:", messageData);

    if (!messageData.sender || !messageData.role) {
      console.error("User data missing in both context and localStorage");
      toast.error("User session error. Please re-login.");
      return;
    }

    try {
      socket.emit("send_message", messageData);

      await axios.post(
        "https://mp-backend-1-82km.onrender.com/api/messages/send",
        messageData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages((prev) => [...prev, messageData]);
      setNewMessage("");
    } catch (err) {
      console.error("Server 500 Error:", err.response?.data);
      toast.error("Server rejected the message. Check backend logs.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC]">
      {/* Header section - Keeping your design exactly as provided */}
      <header className="bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm text-left">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-50 rounded-full transition"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-md shadow-teal-100 text-lg">
              {user?.role?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="font-black text-slate-800 italic leading-tight uppercase text-xs tracking-widest text-left">
                Live Support Room
              </h2>
              <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>{" "}
                Active Connection
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages area - Keeping your exact design */}
      <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg, index) => {
          const isMe = msg.sender === user?._id || msg.sender === user?.id;

          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] p-4 rounded-[1.5rem] text-sm font-medium shadow-sm 
        ${
          isMe
            ? "bg-[#0D9488] text-white rounded-tr-none"
            : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
        }`}
              >
                <p className="leading-relaxed text-left">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input form - Keeping your exact design */}
      <form
        onSubmit={handleSendMessage}
        className="p-6 bg-white border-t border-slate-100 flex items-center gap-3"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-teal-400 italic"
        />
        <button
          type="submit"
          className="bg-[#0D9488] text-white p-4 rounded-2xl hover:bg-teal-700 transition shadow-lg shadow-teal-100"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatPage;

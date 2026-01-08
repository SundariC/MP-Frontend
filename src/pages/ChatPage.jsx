import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import API from "../services/api";

// Socket configuration with transports to fix connection issues
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

 
 const getSafeUser = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  return {
    id: user?.id || storedUser?.id,
    role: user?.role || storedUser?.role,
  };
};


  useEffect(() => {
    if (bookingId && token) {
      socket.emit("join_room", bookingId);
      fetchChatHistory();
    }

    socket.on("receive_message", (data) => {
      if (data.bookingId === bookingId) {
        setMessages((prev) => {
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
      const res = await API.get(`/messages/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
  
  const currentId = user?._id || user?.id || storedUser?._id || storedUser?.id || storedUser?.userId;

  if (!currentId) {
    console.error("CRITICAL: No ID found in storage!", storedUser);
    toast.error("Session Expired. Please Logout and Login again.");
    return;
  }

  const messageData = {
    bookingId,
    sender: currentId,
    text: newMessage,
    role: user?.role || storedUser?.role || "client",
    timestamp: new Date().toISOString(),
  };

  try {
    socket.emit("send_message", messageData);
    await API.post("/messages/send", messageData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");
  } catch (err) {
    toast.error("Message failed to send.");
  }
};


  // Get user once for the UI logic
  const currentUser = getSafeUser();

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC]">
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
              {currentUser?.role?.charAt(0).toUpperCase() || "U"}
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

      <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg, index) => {
          // FIXED: Comparing sender ID with the reliably extracted ID
         const isMe =
  msg.sender?.toString?.() === currentUser.id?.toString?.();
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
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ChatPage;
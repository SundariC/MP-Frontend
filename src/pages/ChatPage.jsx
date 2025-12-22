import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Send, ChevronLeft } from 'lucide-react';

const socket = io('http://localhost:3000'); // Unga backend URL

const ChatPage = () => {
  const { sessionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    // Session room-la join panrom
    socket.emit('join_room', sessionId);

    // Messages-ah receive panrom
    socket.on('receive_message', (data) => {
      setChatLog((prev) => [...prev, data]);
    });

    return () => socket.off('receive_message');
  }, [sessionId]);

  // Automatic scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const msgData = {
        room: sessionId,
        sender: user.fullName,
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      socket.emit('send_message', msgData);
      setChatLog((prev) => [...prev, msgData]);
      setMessage('');
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col max-w-2xl mx-auto border-x border-slate-100 shadow-2xl">
      {/* Header */}
      <div className="p-6 bg-white border-b border-slate-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-slate-600" />
        </button>
        <div>
          <h2 className="font-black text-slate-900">Live Counseling Chat</h2>
          <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">End-to-End Encrypted</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {chatLog.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.sender === user.fullName ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl font-medium text-sm shadow-sm ${
              msg.sender === user.fullName ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
            <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase">{msg.time}</span>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-6 bg-white border-t border-slate-100 flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none font-medium"
        />
        <button type="submit" className="p-4 bg-teal-600 text-white rounded-2xl shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all transform active:scale-95">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
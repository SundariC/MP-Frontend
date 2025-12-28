import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LayoutDashboard, Users, Calendar, FileText, CreditCard, LogOut,
  Search, Video, MessageSquare, Clock, ClipboardList
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  const fetchUserSessions = async () => {
    try {
      const res = await axios.get(
        'http://localhost:3000/api/bookings/my-bookings',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching sessions', err);
    }
  };

  useEffect(() => {
    if (token) fetchUserSessions();
  }, [token]);

  // Logic to separate bookings
  const upcomingSessions = bookings.filter(b => b.sessionStatus === "UPCOMING");
  const completedSessions = bookings.filter(b => b.sessionStatus === "COMPLETED");
  const totalPaid = bookings.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <ToastContainer />
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col p-6 sticky top-0 h-screen">
        {/* <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-[#0D9488] p-2 rounded-xl text-white font-black text-xl italic shadow-lg shadow-teal-100">M</div>
          <span className="font-black text-slate-800 text-xl tracking-tighter italic text-left">MindConnect</span>
        </div> */}
        
        <nav className="space-y-2 flex-grow text-left">
          <button onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "dashboard" ? "bg-[#0D9488] text-white shadow-lg shadow-teal-100" : "text-slate-500 hover:bg-slate-50"}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => navigate('/browsercounselors')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition">
            <Users size={20} /> Find Counselor
          </button>
          <button onClick={() => setActiveTab("records")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "records" ? "bg-[#0D9488] text-white shadow-lg shadow-teal-100" : "text-slate-500 hover:bg-slate-50"}`}>
            <FileText size={20} /> My Records
          </button>
        </nav>

        <div className="border-t pt-6">
          <button onClick={logout} className="flex items-center gap-2 text-xs font-black text-red-500 hover:text-red-700 transition-colors uppercase italic"><LogOut size={16} /> Logout Account</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow p-8">
        <header className="flex justify-between items-center mb-10">
          <div className="text-left">
            <h1 className="text-3xl font-black text-slate-900 leading-tight italic">Hello, {user?.fullName?.split(' ')[0]}</h1>
            <p className="text-slate-500 font-medium italic">Your wellness journey is our priority.</p>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 text-left">
          <div className="lg:col-span-2 space-y-8">
            
            {/* UPCOMING SESSIONS TAB */}
            {activeTab === "dashboard" && (
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[400px]">
                <h3 className="font-bold text-slate-800 mb-8 uppercase text-xs tracking-widest flex items-center gap-2">
                  Active Bookings
                  <span className="bg-teal-50 text-teal-600 px-2 py-0.5 rounded-lg text-xs">{upcomingSessions.length}</span>
                </h3>

                <div className="space-y-6">
                  {upcomingSessions.map(session => (
                    <div key={session._id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-teal-600 border border-slate-100 text-xl">{session.counselor?.fullName?.charAt(0)}</div>
                          <div>
                            <p className="font-black text-slate-800 text-lg italic">Dr. {session.counselor?.fullName}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">{new Date(session.appointmentDate).toDateString()} • {session.timeSlot}</p>
                          </div>
                        </div>
                        <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${session.videoLink ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700 animate-pulse'}`}>
                          {session.videoLink ? 'Counselor Ready' : 'Waiting for Approval'}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        {/* ✅ Video Call button only works if videoLink exists */}
                        <button
                          disabled={!session.videoLink}
                          onClick={() => navigate(`/video-call/${session._id}`)}
                          className={`flex-[2] py-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 transition-all italic shadow-lg ${session.videoLink ? 'bg-slate-900 text-white hover:bg-black shadow-slate-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                        >
                          <Video size={16} /> {session.videoLink ? 'Join Video Call' : 'Call Not Ready'}
                        </button>

                        <button onClick={() => navigate(`/chat/${session._id}`)} className="flex-1 bg-white border border-slate-200 text-teal-600 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-teal-50 transition-all italic">
                          <MessageSquare size={16} /> Live Chat
                        </button>
                      </div>
                    </div>
                  ))}
                  {upcomingSessions.length === 0 && <p className="text-center text-slate-400 font-bold italic py-10">No upcoming sessions found.</p>}
                </div>
              </div>
            )}

            {/* MY RECORDS TAB */}
            {activeTab === "records" && (
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[400px]">
                <h3 className="font-bold text-slate-800 mb-8 uppercase text-xs tracking-widest flex items-center gap-2">Completed Sessions</h3>
                <div className="space-y-6">
                  {completedSessions.map(session => (
                    <div key={session._id} className="p-6 border-l-[8px] border-teal-600 bg-slate-50 rounded-2xl space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-black text-slate-800 text-lg italic uppercase tracking-tighter">Dr. {session.counselor?.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-black italic">{new Date(session.updatedAt).toDateString()}</p>
                        </div>
                        <div className="text-[10px] font-black text-teal-600 bg-white px-3 py-1 rounded-lg border shadow-sm flex items-center gap-1 uppercase italic"><Clock size={12}/> {session.duration || "45"} Mins Session</div>
                      </div>
                      
                      {/* ✅ Counselor Session Notes Display */}
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase italic">Session Notes from Dr.</p>
                        <div className="bg-white p-4 rounded-xl border border-slate-100 italic text-[11px] text-slate-600 leading-relaxed shadow-inner">
                          "{session.sessionNotes || "No notes were recorded for this session."}"
                        </div>
                      </div>
                      <button onClick={() => navigate(`/chat-page/${session._id}`)} className="flex items-center gap-2 text-[10px] font-black text-teal-600 uppercase hover:underline italic"><MessageSquare size={14} /> View Chat History</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR STATS */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
               <img src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=0D9488&color=fff`} className="w-20 h-20 rounded-3xl border-4 border-slate-50 shadow-md mx-auto mb-4" alt="Avatar"/>
               <h4 className="font-black text-slate-800 italic uppercase text-sm">{user?.fullName}</h4>
               <p className="text-[10px] text-slate-400 font-black uppercase mb-6 italic tracking-widest">Client Account</p>
               <button onClick={() => navigate('/browsercounselors')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] hover:bg-black transition-all shadow-xl italic uppercase tracking-widest">Book New Session</button>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-4 text-sm italic uppercase tracking-widest">Wallet & Payments</h4>
              <div className="text-center py-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200 mb-4">
                <p className="text-4xl font-black text-slate-900 tracking-tighter italic">₹{totalPaid}</p>
                <p className="text-[9px] text-slate-400 font-black uppercase mt-1 italic">Total Wellness Investment</p>
              </div>
              <button className="w-full py-3 border border-slate-100 text-slate-400 rounded-xl font-black text-[9px] uppercase italic">Download Receipts</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
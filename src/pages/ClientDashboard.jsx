import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Video,
  LayoutDashboard,
  ClipboardList,
  Clock,
  LogOut,
  User,
  Bell,
  Camera,
  XCircle,
  MessageCircle,
  Users,
  Calendar,
  Search,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../services/api";

const ClientDashboard = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showBellPopup, setShowBellPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("requests");

  const fetchUserSessions = async () => {
    try {
      const res = await API.get("/bookings/my-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching sessions", err);
    }
  };

  useEffect(() => {
    if (token) fetchUserSessions();
  }, [token]);

  const endSession = async (bookingId) => {
    try {
      await API.put(
        `/bookings/end-session/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Session completed");
      fetchUserSessions();
    } catch (err) {
      console.error(err);
      toast.error("Unable to end session");
    }
  };

  // Logic to separate bookings (Counselor Model)
  const requests = bookings.filter(
    (b) => b.sessionStatus === "UPCOMING" && !b.videoLink
  );
  const activeSessions = bookings.filter(
    (b) => b.sessionStatus === "UPCOMING" && b.videoLink
  );
  const completed = bookings.filter((b) => b.sessionStatus === "COMPLETED");
  const totalSpent = bookings.reduce(
    (acc, b) => acc + (Number(b.amount) || 0),
    0
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <ToastContainer />

      {/* SIDEBAR - EXACTLY LIKE COUNSELOR */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col p-6 sticky top-0 h-screen">
        <nav className="space-y-2 flex-grow text-left">
          <button
            onClick={() => setActiveTab("requests")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === "requests"
                ? "bg-[#0D9488] text-white shadow-lg"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Clock size={20} /> Requests
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === "active"
                ? "bg-[#0D9488] text-white shadow-lg"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Video size={20} /> Active
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === "completed"
                ? "bg-[#0D9488] text-white shadow-lg"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <ClipboardList size={20} /> Records
          </button>
        </nav>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 mt-auto"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="flex-grow p-8">
        <header className="flex justify-between items-center mb-10">
          <div className="text-left">
            <h1 className="text-3xl font-black text-slate-900 leading-tight italic">
              Hello, {user?.fullName?.split(" ")[0]}
            </h1>
            <p className="text-slate-500 font-medium italic text-sm text-left">
              Client Dashboard
            </p>
          </div>
          <button
            onClick={() => setShowBellPopup(!showBellPopup)}
            className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 hover:text-teal-600 relative"
          >
            <Bell size={20} />
            {showBellPopup && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border p-4 z-50 text-xs font-bold text-slate-500">
                No new notifications
              </div>
            )}
          </button>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 text-left">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[500px]">
              <h3 className="font-bold text-slate-800 mb-8 uppercase text-xs tracking-widest flex items-center gap-2">
                Current {activeTab}
                <span className="bg-teal-50 text-teal-600 px-2 py-0.5 rounded-lg">
                  {activeTab === "requests"
                    ? requests.length
                    : activeTab === "active"
                    ? activeSessions.length
                    : completed.length}
                </span>
              </h3>

              <div className="space-y-6 outline-none">
                {/* REQUESTS TAB (WAITING FOR COUNSELOR) */}
                {activeTab === "requests" &&
                  requests.map((b) => (
                    <div
                      key={b._id}
                      className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between outline-none"
                    >
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-teal-600 border border-slate-100 uppercase">
                          {b.counselor?.fullName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 italic">
                            Dr. {b.counselor?.fullName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            {new Date(b.appointmentDate).toDateString()} •{" "}
                            {b.appointmentTime}
                          </p>
                        </div>
                      </div>
                      <span className="bg-orange-50 text-orange-600 text-[9px] font-black px-3 py-1 rounded-full animate-pulse uppercase">
                        Waiting for Approval
                      </span>
                    </div>
                  ))}

                {/* ACTIVE TAB (JOIN CALL/CHAT) */}
                {activeTab === "active" &&
                  activeSessions.map((b) => (
                    <div
                      key={b._id}
                      className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-teal-600 shadow-sm">
                            <User size={20} />
                          </div>
                          <div>
                            <p className="font-black text-slate-800 italic text-lg">
                              Dr. {b.counselor?.fullName}
                            </p>
                            <p className="text-[10px] text-slate-400 font-black italic uppercase">
                              Session is Live
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/chat/${b._id}`)}
                          className="p-2 bg-white border rounded-xl text-teal-600 hover:bg-teal-50"
                        >
                          <MessageCircle size={20} />
                        </button>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/video-call/${b._id}`)}
                          className="flex-[2] bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2 italic"
                        >
                          START VIDEO CALL
                        </button>
                        <button
                          onClick={() => endSession(b._id)}
                          className="flex-1 bg-red-500 text-white py-3 rounded-xl font-black text-[10px] uppercase hover:bg-red-600"
                        >
                          END SESSION
                        </button>
                      </div>
                    </div>
                  ))}

                {/* RECORDS TAB (SAME AS COUNSELOR) */}
                {/* {activeTab === "completed" && completed.map((b) => (
                  <div key={b._id} className="p-6 border-l-[8px] border-teal-600 bg-slate-50 rounded-2xl space-y-3 text-left">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black text-slate-800 text-lg italic uppercase tracking-tighter">Dr. {b.counselor?.fullName}</p>
                        <p className="text-[10px] text-slate-500 font-bold italic flex items-center gap-1 mt-1"><Clock size={10}/> {new Date(b.appointmentDate).toLocaleDateString()}</p>
                      </div>
                      <span className="bg-teal-100 text-teal-700 text-[9px] font-black px-2 py-1 rounded-md uppercase">Completed</span>
                      <button onClick={() => navigate("/checkoutPage", { state: { counselor: b.counselor } })} className="w-full py-2 bg-teal-600 text-white rounded-2xl font-black text-[10px] hover:bg-teal-700 transition-all shadow-lg italic uppercase flex items-center justify-center gap-2"> BOOK AGAIN</button>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => { setSelectedNote(b.sessionNotes); setShowNoteModal(true); }} className="flex-1 bg-white border border-slate-200 py-2 rounded-xl font-black text-[10px] text-teal-600 flex items-center justify-center gap-2 shadow-sm italic"><ClipboardList size={14} /> VIEW SESSION NOTES</button>
                      <button onClick={() => navigate(`/chat/${b._id}`)} className="flex-1 bg-white border border-slate-200 py-2 rounded-xl font-black text-[10px] text-teal-600 flex items-center justify-center gap-2 shadow-sm italic"><MessageCircle size={14} /> CHAT HISTORY</button>
                    </div>
                  </div>
                ))} */}
                {activeTab === "completed" &&
                  completed.map((b) => (
                    <div
                      key={b._id}
                      className="p-6 border-l-[8px] border-teal-600 bg-slate-50 rounded-2xl space-y-4 text-left shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-black text-slate-800 text-lg italic uppercase tracking-tighter">
                            Dr. {b.counselor?.fullName}
                          </p>
                          <p className="text-[10px] text-slate-500 font-bold italic flex items-center gap-1 mt-1">
                            <Clock size={10} />{" "}
                            {new Date(b.appointmentDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="bg-teal-100 text-teal-700 text-[9px] font-black px-2 py-1 rounded-md uppercase">
                          Completed
                        </span>
                      </div>

                      {/* Buttons Section */}
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedNote(b.sessionNotes);
                              setShowNoteModal(true);
                            }}
                            className="flex-1 bg-white border border-slate-200 py-2 rounded-xl font-black text-[10px] text-teal-600 flex items-center justify-center gap-2 shadow-sm italic"
                          >
                            <ClipboardList size={14} /> VIEW NOTES
                          </button>
                          <button
                            onClick={() => navigate(`/chat/${b._id}`)}
                            className="flex-1 bg-white border border-slate-200 py-2 rounded-xl font-black text-[10px] text-teal-600 flex items-center justify-center gap-2 shadow-sm italic"
                          >
                            <MessageCircle size={14} /> HISTORY
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            const counselorData = {
                              ...b.counselor,

                              _id: b.counselor?._id || b.counselorId,
                            };

                            console.log("Booking Again with:", counselorData);

                            navigate("/checkoutPage", {
                              state: { counselor: counselorData },
                            });
                          }}
                          className="w-full py-3 bg-teal-600 text-white rounded-xl font-black text-[11px] hover:bg-teal-700 transition-all shadow-md italic uppercase flex items-center justify-center gap-2"
                        >
                          <Calendar size={14} /> BOOK AGAIN WITH DR.{" "}
                          {b.counselor?.fullName.split(" ")[0]}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR STATS */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
              <div className="relative inline-block mb-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=0D9488&color=fff`}
                  className="w-20 h-20 rounded-3xl border-4 border-slate-50 shadow-md"
                  alt="Avatar"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-lg">
                  <Camera size={12} />
                </button>
              </div>
              <h4 className="font-black text-slate-800 italic uppercase text-sm">
                {user?.fullName}
              </h4>
              <p className="text-[10px] text-slate-400 font-black uppercase mb-6 italic tracking-widest">
                Client Account
              </p>
              <button
                onClick={() => navigate("/browsercounselors")}
                className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black text-[10px] hover:bg-teal-700 transition-all shadow-lg italic uppercase flex items-center justify-center gap-2"
              >
                <Search size={14} /> Book New Session
              </button>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-4 text-sm italic uppercase tracking-widest">
                Spending
              </h4>
              <div className="text-center py-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-4xl font-black text-slate-900 tracking-tighter">
                  ₹{totalSpent}
                </p>
                <p className="text-[9px] text-slate-400 font-black uppercase mt-1 italic">
                  Total Invested in Wellness
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL FOR SESSION NOTES - EXACTLY LIKE COUNSELOR */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black italic text-slate-800 uppercase tracking-tighter text-left">
                Session Notes
              </h3>
              <button
                onClick={() => setShowNoteModal(false)}
                className="text-slate-400 hover:text-red-500"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 min-h-[150px] text-left italic text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
              {selectedNote || "No notes were recorded for this session."}
            </div>
            <button
              onClick={() => setShowNoteModal(false)}
              className="w-full mt-6 bg-slate-900 text-white py-4 rounded-2xl font-black italic text-xs uppercase shadow-lg"
            >
              CLOSE RECORDS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;

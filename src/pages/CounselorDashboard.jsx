import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Video,
  Check,
  X,
  LayoutDashboard,
  ClipboardList,
  Clock,
  LogOut,
  User,
  CreditCard,
  Bell,
  Camera,
  XCircle,
  Save,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CounselorDashboard = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null); 
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showBellPopup, setShowBellPopup] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("requests");
  const [sessionNotes, setSessionNotes] = useState({});

  const [profile, setProfile] = useState({
    specialization: user?.specialization || "",
    price: 500,
    bio: user?.bio || "",
  });

  const SESSION_PRICE = 500;

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/bookings/my-bookings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookings(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  const fetchUserSessions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/bookings/my-bookings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSessions(res.data);
    } catch (err) {
      console.error("Error fetching sessions", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBookings();
      fetchUserSessions();
    }
  }, [token]);

  const handleEndAndSave = async (bookingId) => {
    try {
      const notes = sessionNotes[bookingId] || "";
      await axios.put(
        "http://localhost:3000/api/bookings/update-status",
        {
          bookingId,
          sessionStatus: "COMPLETED",
          sessionNotes: notes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Session completed & saved to Records!");
      fetchBookings();
    } catch (err) {
      toast.error("Update failed!");
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      await axios.put(
        "http://localhost:3000/api/bookings/update-status",
        { bookingId, sessionStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.info(`Status updated to ${status}`);
      fetchBookings();
    } catch (err) {
      toast.error("Failed to update.");
    }
  };

  const totalPaid = sessions.reduce(
    (acc, session) => acc + (Number(session.amount) || 0),
    0
  );
  const requests = bookings.filter(
    (b) => b.sessionStatus === "UPCOMING" && !b.videoLink
  );
  const activeSessions = bookings.filter(
    (b) => b.sessionStatus === "UPCOMING" && b.videoLink
  );
  const completed = bookings.filter((b) => b.sessionStatus === "COMPLETED");

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <ToastContainer />

      <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-[#0D9488] p-2 rounded-xl text-white font-black text-xl italic shadow-lg">
            M
          </div>
          <span className="font-black text-slate-800 text-xl tracking-tighter italic">
            MindConnect
          </span>
        </div>
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
              Dr. {user?.fullName?.split(" ")[0]}
            </h1>
            <p className="text-slate-500 font-medium italic text-sm text-left">
              Counselor Dashboard
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

              <div className="space-y-6">
                {activeTab === "requests" &&
                  requests.map((b) => (
                    <div
                      key={b._id}
                      className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-teal-600 border border-slate-100">
                          {b.client?.fullName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 italic">
                            {b.client?.fullName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            {new Date(b.appointmentDate).toDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(b._id, "UPCOMING")}
                          className="bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700 shadow-md"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => updateStatus(b._id, "CANCELLED")}
                          className="bg-white border text-red-500 p-3 rounded-xl hover:bg-red-50"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

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
                            <p className="font-black text-slate-800 italic">
                              {b.client?.fullName}
                            </p>
                            <p className="text-[10px] text-slate-400 font-black italic">
                              LIVE SESSION
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
                      {/* TEXTAREA ENABLED TO CAPTURE NOTES */}
                      <textarea
                        placeholder="Write session notes here..."
                        className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-xs font-medium outline-none focus:ring-2 focus:ring-teal-400 h-20"
                        value={sessionNotes[b._id] || ""}
                        onChange={(e) =>
                          setSessionNotes({
                            ...sessionNotes,
                            [b._id]: e.target.value,
                          })
                        }
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/video-call/${b._id}`)}
                          className="flex-[2] bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2"
                        >
                          START CALL
                        </button>
                        <button
                          onClick={() => handleEndAndSave(b._id)}
                          className="bg-teal-600 text-white px-4 py-2 rounded-xl font-bold text-[10px]"
                        >
                          COMPLETE SESSION
                        </button>
                      </div>
                    </div>
                  ))}

                {activeTab === "completed" &&
                  completed.map((b) => (
                    <div
                      key={b._id}
                      className="p-6 border-l-[8px] border-teal-600 bg-slate-50 rounded-2xl space-y-3 text-left"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-black text-slate-800 text-lg italic">
                            {b.client?.fullName}
                          </p>
                          {/* SHOWING DATE AND TIME */}
                          <div className="flex gap-3 mt-1">
                             <p className="text-[10px] text-slate-500 font-bold italic flex items-center gap-1">
                               <Clock size={10}/> {new Date(b.appointmentDate).toLocaleDateString()}
                             </p>
                             <p className="text-[10px] text-teal-600 font-bold italic flex items-center gap-1">
                               {b.appointmentTime}
                             </p>
                          </div>
                        </div>
                        <span className="bg-teal-100 text-teal-700 text-[9px] font-black px-2 py-1 rounded-md">COMPLETED</span>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => {
                            setSelectedNote(b.sessionNotes);
                            setShowNoteModal(true);
                          }}
                          className="flex-1 bg-white border border-slate-200 py-2 rounded-xl font-black text-[10px] text-teal-600 flex items-center justify-center gap-2 shadow-sm"
                        >
                          <ClipboardList size={14} /> VIEW SESSION NOTES
                        </button>

                        <button
                          onClick={() => navigate(`/chat/${b._id}`)}
                          className="flex-1 bg-white border border-slate-200 py-2 rounded-xl font-black text-[10px] text-teal-600 flex items-center justify-center gap-2 shadow-sm"
                        >
                          <ClipboardList size={14} /> CHAT HISTORY
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

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
                Dr. {user?.fullName}
              </h4>
              <p className="text-[10px] text-slate-400 font-black uppercase mb-6 italic">
                {profile.specialization || "Expert Counselor"}
              </p>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="w-full py-3 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl font-black text-[10px] hover:bg-slate-100 transition italic"
              >
                MANAGE PROFILE
              </button>

              {isEditingProfile && (
                <form className="mt-4 space-y-3 text-left animate-in fade-in slide-in-from-top-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                    Update Counselor Info
                  </p>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 ml-1">
                      Specialization
                    </label>
                    <select
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-teal-400"
                      value={profile.specialization}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          specialization: e.target.value,
                        })
                      }
                    >
                      <option value="mental">Mental Health</option>
                      <option value="career">Career Counseling</option>
                      <option value="relationship">Relationship</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 ml-1">
                      Session Fee (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="Price per session"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-teal-400"
                      value={profile.price}
                      onChange={(e) =>
                        setProfile({ ...profile, price: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 ml-1">
                      Professional Bio
                    </label>
                    <textarea
                      placeholder="Describe your experience..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold h-24 resize-none outline-none focus:ring-2 focus:ring-teal-400"
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        toast.success("Profile Updated Successfully!");
                        setIsEditingProfile(false);
                      }}
                      className="flex-1 bg-teal-600 text-white py-3 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-teal-100 transition-all hover:bg-teal-700"
                    >
                      Save Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 bg-slate-100 text-slate-500 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-4 text-sm italic uppercase tracking-widest">
                Earnings
              </h4>
              <div className="text-center py-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-4xl font-black text-slate-900 tracking-tighter">
                  ₹{totalPaid}
                </p>
                <p className="text-[9px] text-slate-400 font-black uppercase mt-1 italic">
                  Total Revenue
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showNoteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black italic text-slate-800 uppercase tracking-tighter text-left">Session Record</h3>
              <button onClick={() => setShowNoteModal(false)} className="text-slate-400 hover:text-red-500">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 min-h-[150px] text-left">
              <p className="text-sm font-medium text-slate-600 italic leading-relaxed whitespace-pre-wrap">
                {selectedNote || "No notes were recorded for this session."}
              </p>
            </div>

            <button
              onClick={() => setShowNoteModal(false)}
              className="w-full mt-6 bg-slate-900 text-white py-4 rounded-2xl font-black italic text-xs uppercase shadow-lg"
            >
              CLOSE RECORD
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselorDashboard;
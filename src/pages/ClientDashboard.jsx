import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  CreditCard,
  LogOut,
  Search,
  Video,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const [sessions, setSessions] = useState([]);

  // 🔴 SESSION PRICE (single place)
  const SESSION_PRICE = 500;

  // ✅ FIXED PAYMENT LOGIC (amount field illa)
  const totalPaid = sessions.reduce(
  (acc, session) => acc + (Number(session.amount) || 0),
  0
);


  const fetchUserSessions = async () => {
    try {
      const res = await axios.get(
        'http://localhost:3000/api/bookings/my-bookings',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSessions(res.data);
    } catch (err) {
      console.error('Error fetching sessions', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserSessions();
    }
  }, [token]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col p-6">
        <nav className="space-y-2 flex-grow">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm bg-[#0D9488] text-white shadow-lg shadow-teal-100">
            <LayoutDashboard size={20} /> Dashboard
          </button>

          <button
            onClick={() => navigate('/browsercounselors')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition"
          >
            <Users size={20} /> Find Counselor
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition">
            <Calendar size={20} /> My Sessions
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition">
            <FileText size={20} /> My Records
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition">
            <CreditCard size={20} /> Payments
          </button>
        </nav>

        <div className="border-t pt-6">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=0D9488&color=fff`}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {user?.fullName}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                Client Account
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 leading-tight">
              Hello, {user?.fullName?.split(' ')[0]}
            </h1>
            <p className="text-slate-500 font-medium">
              Here's your wellness overview.
            </p>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                Upcoming Sessions
                <span className="bg-teal-50 text-teal-600 px-2 py-0.5 rounded-lg text-xs">
                  {sessions.length}
                </span>
              </h3>

              {sessions.length > 0 ? (
                <div className="space-y-6">
                  {sessions.map(session => (
                    <div
                      key={session._id}
                      className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group transition-all"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-white p-3 rounded-2xl shadow-sm text-teal-600">
                            <Video size={24} />
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-lg">
                              Dr.{' '}
                              {session.counselor?.fullName ||
                                'Expert Counselor'}
                            </p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                              {new Date(
                                session.appointmentDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* ✅ REAL PAYMENT STATUS */}
                        <span
                          className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full ${
                            session.isPaid
                              ? 'bg-teal-100 text-teal-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {session.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() =>
                            navigate(`/video-call/${session._id}`)
                          }
                          className="flex-1 bg-teal-600 text-white py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-teal-700 transition-all shadow-lg shadow-teal-50"
                        >
                          <Video size={16} /> START VIDEO CALL
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/chat-page/${session._id}`)
                          }
                          className="flex-1 bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                        >
                          <MessageSquare size={16} /> LIVE CHAT
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Calendar size={30} />
                  </div>
                  <p className="text-slate-400 text-sm font-bold">
                    No sessions found.
                  </p>
                  <button
                    onClick={() => navigate('/browsercounselors')}
                    className="mt-4 text-[#0D9488] font-black text-sm hover:underline"
                  >
                    Book Now
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* PAYMENT STATUS CARD */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-4 tracking-tight text-lg">
                Payment Status
              </h4>

              <div className="text-center py-8 bg-slate-50 rounded-3xl mb-4 border border-slate-100 border-dashed">
                <p className="text-5xl font-black text-slate-900 tracking-tighter">
                  ₹{totalPaid}
                </p>
                <p className="text-[10px] text-slate-400 font-black uppercase mt-2 tracking-widest">
                  Total Investment
                </p>
              </div>

              <button className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs shadow-sm">
                VIEW RECEIPTS
              </button>
            </div>

            <div className="bg-[#E0F2F1] p-8 rounded-[2.5rem] border border-teal-100 relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm text-teal-600">
                  <Search size={24} />
                </div>
                <h4 className="font-black text-slate-900 mb-2 text-lg">
                  Explore Experts
                </h4>
                <p className="text-xs text-slate-600 mb-6 leading-relaxed font-bold uppercase tracking-tight opacity-70">
                  Find the perfect specialist for your journey.
                </p>
                <button
                  onClick={() => navigate('/browsercounselors')}
                  className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-xs shadow-sm hover:shadow-md transition"
                >
                  BROWSE NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;

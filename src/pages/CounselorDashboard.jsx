import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, Users, FileText, 
  DollarSign, User, LogOut, Settings, Video, MessageSquare, Check, X 
} from 'lucide-react';

const CounselorDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const [bookings, setBookings] = useState([]);

  // ✅ Calculation logic (Ensure backend sends 'amount')
  const totalEarnings = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'paid')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const fetchMyBookings = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/bookings/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // console.log("Check Amount here:", res.data); // Debug panni paarunga amount varudha-nu
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings", err);
    }
  };

  // ✅ Status update (Accept/Reject) logic
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/api/bookings/update-status/${bookingId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchMyBookings(); // Refresh the list
      alert(`Session ${newStatus === 'confirmed' ? 'Accepted' : 'Cancelled'}`);
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  useEffect(() => {
    if (token) fetchMyBookings();
  }, [token]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR (Unga code-la irukradhu maadhiriye vachukalam) */}
      <aside className="w-64 bg-white border-r border-slate-100 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-10 px-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg"></div>
            <span className="font-black text-xl text-slate-800">MindConnect</span>
          </div>
          <nav className="space-y-1">
            <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
            <NavItem icon={<Calendar size={20}/>} label="Availability" />
            <NavItem icon={<DollarSign size={20}/>} label="Earnings" />
          </nav>
        </div>
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <button onClick={logout} className="flex items-center gap-2 text-red-500 font-bold text-sm"><LogOut size={18}/> Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
     <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 leading-tight">Welcome, Dr. {user?.fullName?.split(' ')[0]}</h1>
            <p className="text-slate-500 font-medium">You have {bookings.filter(b => b.status === 'pending').length} new requests.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <h3 className="text-lg font-black text-slate-800 mb-8">Appointment Requests</h3>
              
<div className="space-y-6">
                {bookings.length > 0 ? bookings.map((booking) => (
                  <div key={booking._id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${booking.client?.fullName || 'User'}&background=eee&color=333`} 
                          className="w-12 h-12 rounded-2xl" 
                          alt="client"
                        />
                        <div>
                          {/* ✅ Anonymous Fix */}
                          <p className="font-black text-slate-800">{booking.client?.fullName || 'Anonymous Client'}</p>
                          {/* ✅ Date Formatting Fix */}
                          <p className="text-xs text-slate-400 font-bold uppercase">
                            {new Date(booking.appointmentDate).toLocaleDateString('en-GB')} • {booking.timeSlot}
                          </p>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${booking.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-teal-100 text-teal-600'}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      {booking.status === 'pending' ? (
                        <>
                          <button onClick={() => handleStatusUpdate(booking._id, 'confirmed')} className="flex-1 bg-teal-600 text-white py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-teal-700 transition-all"><Check size={16}/> ACCEPT REQUEST</button>
                          <button onClick={() => handleStatusUpdate(booking._id, 'cancelled')} className="flex-1 bg-white border border-slate-200 text-red-500 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-red-50 transition-all"><X size={16}/> DECLINE</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => navigate(`/video-call/${booking._id}`)} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"><Video size={16}/> START VIDEO SESSION</button>
                          <button onClick={() => navigate(`/chat/${booking._id}`)} className="flex-1 bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"><MessageSquare size={16}/> LIVE CHAT</button>
                        </>
                      )}
                    </div>
                  </div>
                )) : (
                  <p className="text-center py-12 text-slate-400 font-bold italic">No bookings found in your schedule.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-teal-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-teal-100">
               <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-2">Total Earnings</p>
               <h2 className="text-5xl font-black tracking-tighter">₹{totalEarnings}</h2>
               <div className="mt-8 pt-6 border-t border-teal-500 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] opacity-60 font-bold uppercase leading-none">Paid Sessions</p>
                    <p className="text-xl font-black mt-1">{bookings.filter(b => b.status === 'confirmed').length}</p>
                  </div>
                  <div className="bg-teal-500 p-3 rounded-2xl shadow-inner"><DollarSign size={24}/></div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-teal-50 text-teal-600' : 'text-slate-500 hover:bg-slate-50'}`}>
    {icon} <span className="font-bold text-sm">{label}</span>
  </div>
);

export default CounselorDashboard;
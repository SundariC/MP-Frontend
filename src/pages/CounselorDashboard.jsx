import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  LayoutDashboard, Calendar, Users, FileText, 
  DollarSign, User, LogOut, Settings, Video 
} from 'lucide-react';

const CounselorDashboard = () => {
  const { user, logout, token } = useAuth();
  const [bookings, setBookings] = useState([]);

  // Backend-la irundhu andha counselor-oda bookings fetch panrom
  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/bookings/my-bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings", err);
      }
    };
    fetchMyBookings();
  }, [token]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r border-slate-100 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-10 px-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg"></div>
            <span className="font-black text-xl text-slate-800 tracking-tight">MindConnect</span>
          </div>

          <nav className="space-y-1">
            <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
            <NavItem icon={<Calendar size={20}/>} label="Availability" />
            <NavItem icon={<Users size={20}/>} label="Clients" />
            <NavItem icon={<FileText size={20}/>} label="Sessions & Notes" />
            <NavItem icon={<DollarSign size={20}/>} label="Earnings" />
            <NavItem icon={<User size={20}/>} label="Profile" />
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=0D9488&color=fff`} 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              alt="Profile"
            />
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight">{user?.fullName}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Counselor</p>
            </div>
          </div>
          <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Welcome back, {user?.fullName?.split(' ')[0]}!</h1>
            <p className="text-slate-500 font-medium mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 shadow-sm">
            <Settings size={18}/> Settings
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* APPOINTMENTS LIST */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-black text-slate-800">Today's Appointments</h3>
                <button className="text-teal-600 font-bold text-sm">View Calendar</button>
              </div>

              <div className="space-y-6">
                {bookings.length > 0 ? bookings.map((booking) => (
                  <div key={booking._id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-6">
                      <div className="text-center min-w-[60px]">
                        <p className="text-sm font-black text-slate-800">{booking.timeSlot || '10:00 AM'}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">EST</p>
                      </div>
                      <div className="w-px h-10 bg-slate-100"></div>
                      <div>
                        <p className="font-black text-slate-800">{booking.client?.name || 'New Client'}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Video size={12}/> Video Session • 50 min
                        </p>
                      </div>
                    </div>
                    <button className="bg-teal-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-teal-50 hover:bg-teal-700 transition-all opacity-0 group-hover:opacity-100">
                      Join Session
                    </button>
                  </div>
                )) : (
                  <p className="text-center py-10 text-slate-400 font-medium italic">No appointments for today.</p>
                )}
              </div>
            </div>
          </div>

          {/* STATS & QUICK ACTIONS */}
          <div className="space-y-8">
            <div className="bg-teal-600 rounded-[2rem] p-8 text-white shadow-xl shadow-teal-100 relative overflow-hidden">
               <div className="relative z-10">
                  <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">Total Earnings (Dec)</p>
                  <h2 className="text-4xl font-black">₹3,250.00</h2>
                  <div className="mt-6 pt-6 border-t border-teal-500 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold opacity-60 uppercase">Next Payout</p>
                      <p className="text-sm font-black">Dec 30, 2025</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-bold text-teal-200">↑ 12% from last month</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for Sidebar Items
const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-teal-50 text-teal-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
    {icon}
    <span className="font-bold text-sm">{label}</span>
  </div>
);

export default CounselorDashboard;
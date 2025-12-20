import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LayoutDashboard, Users, Calendar, FileText, CreditCard, LogOut, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [sessions, setSessions] = useState([]); // Default empty array (No fake data)
  const [payments, setPayments] = useState([]);

  // Backend-la irundhu user-oda bookings fetch panna logic (Soon we will add)
  useEffect(() => {
    // fetchUserSessions(); 
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col p-6">
        {/* <div className="flex items-center gap-2 text-[#0D9488] font-bold text-xl mb-10">
          <div className="w-8 h-8 bg-[#0D9488] rounded-lg"></div> MindConnect
        </div> */}
        
        <nav className="space-y-2 flex-grow">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm bg-[#0D9488] text-white shadow-lg shadow-teal-100">
            <LayoutDashboard size={20}/> Dashboard
          </button>
          <button onClick={() => navigate('/browsercounselors')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition">
            <Users size={20}/> Find Counselor
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition">
            <Calendar size={20}/> My Sessions
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition">
            <FileText size={20}/> My Records
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition">
            <CreditCard size={20}/> Payments
          </button>
        </nav>

        {/* PROFILE SECTION IN SIDEBAR */}
        <div className="border-t pt-6">
          <div className="flex items-center gap-3 mb-4">
            <img src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=0D9488&color=fff`} className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-xs font-bold text-slate-800">{user?.fullName}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Client Account</p>
            </div>
          </div>
          <button onClick={() => {localStorage.clear(); navigate('/');}} className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-700">
            <LogOut size={16}/> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Hello, {user?.fullName?.split(' ')[0]}</h1>
            <p className="text-slate-500">Here's your wellness overview for today.</p>
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl relative">
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            Notifications
          </button>
        </header>

        {/* DATA DISPLAY AREA */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* UPCOMING SESSIONS (Real Data only) */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6">Upcoming Sessions</h3>
              {sessions.length > 0 ? (
                // Map real sessions here
                <div>Session list...</div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Calendar size={30}/>
                  </div>
                  <p className="text-slate-400 text-sm font-medium">No upcoming sessions found.</p>
                  <button onClick={() => navigate('/browsercounselors')} className="mt-4 text-[#0D9488] font-bold text-sm hover:underline">Book a session now</button>
                </div>
              )}
            </div>

            {/* PAST SESSIONS */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-6">Past Sessions</h3>
               <p className="text-slate-400 text-sm text-center py-5">No history available.</p>
            </div>
          </div>

          {/* RIGHT SIDEBAR CONTENT */}
          <div className="space-y-8">
             {/* PAYMENT CARD */}
             <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4">Payment Status</h4>
                <div className="text-center py-6">
                   <p className="text-3xl font-black text-slate-900">$0.00</p>
                   <p className="text-xs text-slate-400 font-bold uppercase mt-1">Total Due</p>
                </div>
                <button className="w-full py-4 bg-slate-100 text-slate-400 rounded-2xl font-bold text-sm cursor-not-allowed">Pay Now</button>
             </div>

             {/* FIND NEW COUNSELOR PROMPT */}
             <div className="bg-[#E0F2F1] p-8 rounded-[2rem] border border-teal-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm text-teal-600">
                  <Search size={20}/>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Find a new counselor</h4>
                <p className="text-xs text-slate-600 mb-6 leading-relaxed">Browse our directory of licensed professionals to find the perfect match.</p>
                <button onClick={() => navigate('/browsercounselors')} className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition">Browse Counselors</button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
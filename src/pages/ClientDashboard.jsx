import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Calendar, Video, MessageSquare, Search, PlusCircle } from 'lucide-react';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await API.get('/bookings/my-bookings');
        setSessions(res.data);
      } catch (err) { console.error(err); }
    };
    fetchSessions();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900">Hi, {user?.fullName?.split(' ')[0]}!</h1>
            <p className="text-slate-500 font-medium">Manage your mental wellness sessions here.</p>
          </div>
          <button 
            onClick={() => navigate('/browsercounselors')}
            className="bg-teal-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-teal-100 hover:scale-105 transition"
          >
            <PlusCircle size={20}/> BOOK NEW SESSION
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SESSIONS LIST */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-6 tracking-tight">Your Appointments</h3>
              {sessions.length > 0 ? (
                <div className="space-y-4">
                  {sessions.map(s => (
                    <div key={s._id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-2xl text-teal-600"><Video size={24}/></div>
                        <div>
                          <p className="font-black text-slate-800">Dr. {s.counselor?.fullName || 'Expert'}</p>
                          <p className="text-xs text-slate-500 font-bold uppercase">{new Date(s.appointmentDate).toLocaleDateString()} • {s.timeSlot}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {s.status === 'confirmed' && (
                          <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold">JOIN CALL</button>
                        )}
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${s.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-teal-100 text-teal-600'}`}>
                          {s.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 font-bold italic">No sessions booked yet.</div>
              )}
            </div>
          </div>

          {/* SIDE INFO */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 text-center">
              <h4 className="font-bold text-slate-500 uppercase text-[10px] tracking-widest mb-2">Total Investment</h4>
              <p className="text-4xl font-black text-slate-900">₹{sessions.reduce((acc, s) => acc + (s.amount || 0), 0)}</p>
            </div>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
              <h4 className="font-bold text-lg mb-2">Need Help?</h4>
              <p className="text-xs opacity-70 mb-6">Our support team is available 24/7 for your assistance.</p>
              <button className="w-full bg-teal-600 py-4 rounded-2xl font-black text-xs">CONTACT SUPPORT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
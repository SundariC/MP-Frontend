import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
  LayoutDashboard, Calendar, DollarSign, LogOut, 
  Check, X, UserCog, Briefcase, Video, Edit3 
} from 'lucide-react';
import { toast } from 'react-toastify';

const CounselorDashboard = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Controls View vs Edit Mode
  
  const [profile, setProfile] = useState({
    specialization: '',
    price: '',
    bio: '',
    experience: '',
    location: ''
  });

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch Bookings
      const bookingRes = await API.get('/bookings/my-bookings');
      setBookings(bookingRes.data);

      // 2. Fetch Latest Profile Data from DB
      const profileRes = await API.get('/auth/me');
      if (profileRes.data) {
        setProfile({
          specialization: profileRes.data.specialization || '',
          price: profileRes.data.price || '',
          bio: profileRes.data.bio || '',
          experience: profileRes.data.experience || '',
          location: profileRes.data.location || ''
        });
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.put(`/bookings/update-status/${id}`, { status });
      toast.success(`Session ${status === 'confirmed' ? 'Accepted' : 'Cancelled'}`);
      fetchDashboardData();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/auth/update-profile', profile);
      toast.success("Professional Profile Updated!");
      
      // Update local storage so data stays synced
      const updatedUser = { ...user, ...res.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setIsEditing(false); // ✅ Closes the form and shows View mode
    } catch (err) {
      toast.error("Update failed. Check your backend.");
    }
  };

  const totalEarnings = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] pt-20">
      <main className="flex-1 p-6 lg:p-10">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Expert Console</h1>
            <p className="text-slate-500 font-medium">Dr. {user?.fullName} • Dashboard</p>
          </div>
          <button onClick={logout} className="text-red-500 font-bold flex items-center gap-2 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition">
            <LogOut size={18}/> Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: BOOKINGS LIST */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2">
                <Calendar size={22} className="text-teal-600"/> Appointment Requests
              </h2>

              <div className="space-y-4">
                {bookings.length > 0 ? bookings.map(booking => (
                  <div key={booking._id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-teal-100 transition-all">
                    <div className="flex items-center gap-4 text-left w-full">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${booking.client?.fullName}&background=0D9488&color=fff`} 
                        className="w-12 h-12 rounded-2xl shadow-sm" alt="client"
                      />
                      <div>
                        <p className="font-bold text-slate-800">{booking.client?.fullName}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                          {new Date(booking.appointmentDate).toLocaleDateString()} • {booking.timeSlot}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      {booking.status === 'pending' ? (
                        <>
                          <button onClick={() => handleStatusUpdate(booking._id, 'confirmed')} className="flex-1 md:flex-none bg-teal-600 text-white p-3 rounded-2xl hover:bg-teal-700 transition shadow-lg shadow-teal-50"><Check size={20}/></button>
                          <button onClick={() => handleStatusUpdate(booking._id, 'cancelled')} className="flex-1 md:flex-none bg-white border border-red-100 text-red-500 p-3 rounded-2xl hover:bg-red-50 transition"><X size={20}/></button>
                        </>
                      ) : (
                        <div className="flex gap-2">
                           {booking.status === 'confirmed' && (
                             <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg shadow-slate-200"><Video size={14}/> Start</button>
                           )}
                           <span className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl ${booking.status === 'confirmed' ? 'bg-teal-50 text-teal-600 border border-teal-100' : 'bg-slate-100 text-slate-400'}`}>
                             {booking.status}
                           </span>
                        </div>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12">
                    <p className="text-slate-400 italic">No appointment requests found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: EARNINGS & PROFILE (VIEW/EDIT) */}
          <div className="space-y-6">
            <div className="bg-teal-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-teal-100">
               <p className="text-[10px] font-black opacity-70 uppercase tracking-widest mb-1">Total Revenue</p>
               <h2 className="text-5xl font-black mb-4">₹{totalEarnings}</h2>
               <div className="pt-4 border-t border-teal-500 text-[10px] font-bold opacity-80 uppercase">Life-time Earnings</div>
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-slate-800 flex items-center gap-2 text-lg">
                  <UserCog size={20} className="text-teal-600"/> Expert Profile
                </h3>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-teal-600 transition">
                    <Edit3 size={18}/>
                  </button>
                )}
              </div>

              {isEditing ? (
                /* --- EDIT FORM MODE --- */
                <form onSubmit={handleProfileUpdate} className="space-y-4 animate-in fade-in zoom-in duration-300">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Specialization</label>
                    <input type="text" value={profile.specialization} onChange={(e) => setProfile({...profile, specialization: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Clinical Psychologist" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Fee (₹)</label>
                      <input type="number" value={profile.price} onChange={(e) => setProfile({...profile, price: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Exp (Yrs)</label>
                      <input type="text" value={profile.experience} onChange={(e) => setProfile({...profile, experience: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Bio</label>
                    <textarea rows="3" value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none resize-none" placeholder="Write about yourself..."></textarea>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs hover:bg-teal-600 transition shadow-lg">SAVE</button>
                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-xs hover:bg-slate-200 transition">CANCEL</button>
                  </div>
                </form>
              ) : (
                /* --- VIEW MODE --- */
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-500">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Domain</p>
                    <p className="font-bold text-slate-800 text-sm">{profile.specialization || "Add specialization"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Fee</p>
                      <p className="font-bold text-slate-800">₹{profile.price || "0"}</p>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Exp</p>
                      <p className="font-bold text-slate-800">{profile.experience || "0"} Yrs</p>
                    </div>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">About Me</p>
                    <p className="text-xs text-slate-600 leading-relaxed italic">{profile.bio || "No bio added yet."}</p>
                  </div>
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="w-full py-4 border-2 border-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-50 transition"
                  >
                    Click to Update Professional Details
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CounselorDashboard;
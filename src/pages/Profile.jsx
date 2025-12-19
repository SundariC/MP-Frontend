import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, LogOut, ArrowLeft, Settings } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6">
      <div className="max-w-xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold mb-6 hover:text-teal-600 transition">
          <ArrowLeft size={18}/> Back
        </button>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 bg-teal-100 rounded-[2rem] flex items-center justify-center text-teal-600 mb-4 border-4 border-white shadow-md">
              <User size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">{user?.fullName}</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Client Member</p>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-slate-50 rounded-2xl flex items-center gap-4">
              <Mail className="text-teal-600" size={20}/>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Email</p>
                <p className="font-bold text-slate-800">{user?.email}</p>
              </div>
            </div>
            
            <div className="p-5 bg-slate-50 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-slate-100 transition">
              <Settings className="text-teal-600" size={20}/>
              <p className="font-bold text-slate-800">Account Settings</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full mt-10 py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition flex items-center justify-center gap-2"
          >
            <LogOut size={18}/> Logout Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
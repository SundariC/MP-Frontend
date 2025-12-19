import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200">
            <span className="text-white font-black text-xl">M</span>
          </div>
          <span className="text-2xl font-bold text-slate-800">MindConnect</span>
        </div>
        
        <div className="flex items-center gap-5">
          {user ? (
            <div className="flex items-center gap-4">
              {/* User Profile Section */}
              <div 
                className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-full transition"
                onClick={() => navigate('/dashboard')}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-800">{user.fullName}</p>
                  <p className="text-[10px] text-teal-600 font-bold uppercase tracking-tight">{user.role}</p>
                </div>
                {/* Image Placeholder - User image upload panna apram idhai mathalaam */}
                <div className="w-10 h-10 bg-teal-100 border-2 border-white shadow-sm rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src={user.image || `https://ui-avatars.com/api/?name=${user.fullName}&background=0D9488&color=fff`} 
                    alt="profile" 
                  />
                </div>
              </div>
              <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-700">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-600">Log in</button>
              <button onClick={() => navigate('/signup')} className="px-6 py-2.5 bg-teal-600 text-white text-sm font-bold rounded-full shadow-lg shadow-teal-100 hover:bg-teal-700 transition">Get Started</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
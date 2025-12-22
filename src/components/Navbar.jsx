import React, { useState, useRef } from 'react';
import { LogOut, Mail, LayoutDashboard, ChevronDown, UserPlus, UserCircle } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext"; // ✅ AuthContext import

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSignupDropdown, setShowSignupDropdown] = useState(false);
  
  // ✅ Context-la irundhu user and logout edukirom
  const { user, logout } = useAuth(); 

  const handleLogout = () => {
    logout(); // ✅ Global-ah logout aagum and redirect aagum
  };

  const handleScroll = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-[100] bg-white border-b border-slate-100 h-20 flex items-center px-12 justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-10 h-10 bg-[#0D9488] rounded-xl flex items-center justify-center shadow-lg shadow-teal-200">
           <span className="text-white font-black text-xl">M</span>
        </div>
        <span className="text-2xl font-bold text-slate-800 tracking-tight">MindConnect</span>
      </div>

     <div className="flex items-center gap-8">
        <div className="hidden lg:flex gap-8 text-sm font-bold text-slate-500">
          <span onClick={() => handleScroll('services-section')} className="hover:text-[#0D9488] cursor-pointer transition-colors">Services</span>
          <span onClick={() => handleScroll('how-it-works')} className="hover:text-[#0D9488] cursor-pointer transition-colors">How It Works</span>
          <span onClick={() => handleScroll('client-section')} className="hover:text-[#0D9488] cursor-pointer transition-colors">For Client</span>
          <span onClick={() => handleScroll('counselor-section')} className="hover:text-[#0D9488] cursor-pointer transition-colors">For Counselor</span>
          <span onClick={() => handleScroll('privacy-section')} className="hover:text-[#0D9488] cursor-pointer transition-colors">Privacy</span>
          <span onClick={() => handleScroll('footer')} className="hover:text-[#0D9488] cursor-pointer transition-colors">Contact</span>
        </div>

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <div 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-full cursor-pointer hover:bg-slate-100 transition-all border border-slate-100"
            >
              <img 
                src={`https://ui-avatars.com/api/?name=${user.fullName || 'User'}&background=0D9488&color=fff`} 
                className="w-9 h-9 rounded-full shadow-sm" 
                alt="profile"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none mb-1">{user.fullName}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{user.role}</p>
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-[110] animate-in fade-in zoom-in duration-150">
                <button 
                  onClick={() => {
                    navigate(user.role === 'client' ? '/client-dashboard' : '/counselor-dashboard');
                    setShowDropdown(false);
                  }}
                  className="flex items-center gap-3 w-full p-3 hover:bg-teal-50 rounded-xl text-sm font-bold text-slate-700 mb-1 group"
                >
                  <LayoutDashboard size={18} className="text-slate-400 group-hover:text-[#0D9488]" />
                  My Dashboard
                </button>
                <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 hover:bg-red-50 rounded-xl text-sm font-bold text-red-500">
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-6 items-center">
            <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-600">Log in</button>
            
            {/* ✅ Signup Dropdown Logic */}
            <div className="relative">
              <button 
                onMouseEnter={() => setShowSignupDropdown(true)}
                className="bg-[#0D9488] text-white px-8 py-3 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-teal-100 transition-all"
              >
                Sign Up
              </button>
              
              {showSignupDropdown && (
                <div 
                  onMouseLeave={() => setShowSignupDropdown(false)}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-[110]"
                >
                  <Link to="/signup" className="flex items-center gap-3 p-3 hover:bg-teal-50 rounded-xl text-sm font-bold text-slate-700">
                    <UserCircle size={18} className="text-[#0D9488]" /> As a Client
                  </Link>
                  <Link to="/counselor-signup" className="flex items-center gap-3 p-3 hover:bg-teal-50 rounded-xl text-sm font-bold text-slate-700 border-t mt-1">
                    <UserPlus size={18} className="text-[#0D9488]" /> As a Counselor
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


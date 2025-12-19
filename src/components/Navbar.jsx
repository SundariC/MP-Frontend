import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

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
          <div onClick={() => navigate('/profile')} className="w-11 h-11 cursor-pointer group relative">
            <img 
              src={`https://ui-avatars.com/api/?name=${user.fullName}&background=0D9488&color=fff`} 
              className="w-full h-full rounded-full border-2 border-transparent group-hover:border-[#0D9488] transition-all shadow-md" 
              alt="profile"
            />
          </div>
        ) : (
          <div className="flex gap-6 items-center">
            <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-600">Log in</button>
            <button onClick={() => navigate('/signup')} className="bg-[#0D9488] text-white px-8 py-3 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-teal-100 transition-all">Sign Up</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
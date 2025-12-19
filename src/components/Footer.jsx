import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();

  // Smooth scroll logic for footer links
  const handleFooterScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/'); 
    }
  };

  return (
    <footer id="footer" className="bg-slate-900 text-slate-300 pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="w-10 h-10 bg-[#0D9488] rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl">M</span>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">MindConnect</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Professional, confidential, and accessible counseling for everyone. Start your journey to better mental health today.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#0D9488] hover:text-white transition-all cursor-pointer">
                <Twitter size={18} />
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#0D9488] hover:text-white transition-all cursor-pointer">
                <Facebook size={18} />
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#0D9488] hover:text-white transition-all cursor-pointer">
                <Instagram size={18} />
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#0D9488] hover:text-white transition-all cursor-pointer">
                <Linkedin size={18} />
              </div>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Platform</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li onClick={() => handleFooterScroll('services-section')} className="hover:text-[#0D9488] cursor-pointer transition-colors">Our Services</li>
              <li onClick={() => handleFooterScroll('how-it-works')} className="hover:text-[#0D9488] cursor-pointer transition-colors">How It Works</li>
              <li onClick={() => handleFooterScroll('flexible-care-section')} className="hover:text-[#0D9488] cursor-pointer transition-colors">For Clients</li>
              <li onClick={() => handleFooterScroll('counselor-section')} className="hover:text-[#0D9488] cursor-pointer transition-colors">For Counselors</li>
              <li className="hover:text-[#0D9488] cursor-pointer transition-colors">Pricing</li>
            </ul>
          </div>

          {/* Column 3: Support & Contact */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-center gap-3 hover:text-white cursor-pointer group">
                <Mail size={16} className="text-[#0D9488]" />
                <span>support@mindconnect.com</span>
              </li>
              <li className="flex items-center gap-3 hover:text-white cursor-pointer">
                <Phone size={16} className="text-[#0D9488]" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 hover:text-white cursor-pointer">
                <MapPin size={16} className="text-[#0D9488]" />
                <span>Chennai, Tamil Nadu, India</span>
              </li>
              <li className="hover:text-[#0D9488] cursor-pointer pt-2">Help Center / FAQ</li>
            </ul>
          </div>

          {/* Column 4: Legal & Newsletter */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Legal</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="hover:text-[#0D9488] cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-[#0D9488] cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-[#0D9488] cursor-pointer transition-colors">Cookie Policy</li>
            </ul>
            <div className="pt-4">
               <p className="text-xs text-slate-500 mb-4 font-bold uppercase tracking-tighter">Subscribe to our newsletter</p>
               <div className="flex bg-slate-800 p-1 rounded-xl">
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="bg-transparent border-none outline-none px-4 py-2 text-xs flex-1 text-white"
                  />
                  <button className="bg-[#0D9488] text-white px-4 py-2 rounded-lg text-xs font-bold">Join</button>
               </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} MindConnect. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
             <span className="hover:text-[#0D9488] cursor-pointer transition-all italic underline underline-offset-4">Security HIPAA Compliant</span>
             <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                System Status: Online
             </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Image1 from "../assets/image1.jpg";
import Image2 from "../assets/image2.jpg";
import Image3 from "../assets/image3.jpg";
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  CheckCircle, 
  Star, 
  Quote, 
  Heart, 
  Users, 
  Briefcase, 
  ArrowRight,
  PlayCircle,
  CheckCircle2
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleScroll = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;  
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

 // Logic for Client Button (Book Session / Find Counselor)
  const handleClientAction = () => {
    if (user) {
      if (user.role === 'client') {
        navigate('/browsercounselors'); 
      } else {
        alert("You are logged in as a Counselor.");
      }
    } else {
      navigate('/signup'); 
    }
  };

  // Logic for Counselor Button (Join as Counselor)
  const handleCounselorAction = () => {
    navigate('/signup'); 
  };

  const goToDashboard = () => {
    if (user.role === 'client') {
      navigate('/client-dashboard');
    } else {
      navigate('/counselor-dashboard');
    }
  };

  return (
    <div className="bg-white overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="pt-12 pb-16 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 bg-teal-50 px-3 py-1.5 rounded-full text-[#0D9488] font-bold text-[10px] uppercase tracking-[0.15em]">
            <span className="w-2 h-2 bg-[#0D9488] rounded-full"></span>
            Licensed Therapists Ready to Help
          </div>
          <h1 className="text-3xl md:text-6xl font-black leading-tight text-slate-900">
            Talk to a professional counselor online form the comfort of home.
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-md">
            Connect with licensed therapists via video, chat or email. Get the support you need, when you need it, completely confidentially.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            {!user ? (
              <>
            <button onClick={handleClientAction} className="bg-[#0D9488] text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all">Book Session</button>
            <button onClick={handleCounselorAction} className="px-8 py-4 rounded-xl font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all">Join as Counselor</button>
          </>
          ) : (
          <>
          <button
          onClick={goToDashboard}
          className="bg-[#0D9488] text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
              >
                Go to Dashboard
              </button>
              {user.role === 'client' && (
              <button 
              onClick={() => navigate('/browsercounselors')}
              className="px-8 py-4 rounded-xl font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  Find a Counselor
                </button>
              )}
          </>
          )}
          </div>
        </div>
        <div className="flex-1">
          <img 
            src={Image3}
            className="w-full rounded-[2.5rem] shadow-xl object-cover max-h-[450px]" 
            alt="Hero" 
          />
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-500 font-medium">What your journey towards wellness looks like.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-12 relative">
            {[
              { n: '1', t: 'Sign Up', d: 'Create your account and complete a brief profile.' },
              { n: '2', t: 'Browse Counselors', d: 'Filter by specialty, language and availability.' },
              { n: '3', t: 'Book & Pay', d: 'Choose a time that works and pay securely.' },
              { n: '4', t: 'Active Session', d: 'Connect via video or chat from anywhere.' }
            ].map((step, idx) => (
              <div key={idx} className="text-center relative z-10">
                <div className="w-16 h-16 bg-[#0D9488] text-white rounded-full flex items-center justify-center text-xl font-black mx-auto mb-6 shadow-lg border-8 border-white">
                  {step.n}
                </div>
                <h4 className="font-bold text-lg mb-2">{step.t}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. OUR SERVICES */}
      <section id="services-section" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Our Services</h2>
          <p className="text-slate-500 text-sm">Professional support for every aspect of your life.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Mental Health', icon: <Heart size={20}/>, desc: 'Support for anxiety, depression, and stress management.' },
            { title: 'Relationships', icon: <Users size={20}/>, desc: 'Guidance for couples and families to build stronger bonds.' },
            { title: 'Career Growth', icon: <Briefcase size={20}/>, desc: 'Overcome workplace stress and professional challenges.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-10 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#0D9488] mb-6 shadow-sm">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">{item.desc}</p>
              <button 
              onClick={() => handleScroll('stories-section')}
              className="flex items-center gap-2 text-[#0D9488] font-bold text-xs uppercase tracking-wider">Learn more <ArrowRight size={14}/></button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FLEXIBLE CARE (Client Section) */}
      <section id="client-section" className="py-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <img src={Image2} className="w-full rounded-[2rem] shadow-lg max-h-[350px] object-cover" alt="Client" />
        </div>
        <div className="flex-1 space-y-6">
          <span className="text-[#0D9488] font-bold text-[10px] uppercase tracking-widest">For Clients</span>
          <h2 className="text-4xl font-black text-slate-900">Flexible care that fits your life</h2>
          <p className="text-slate-500 text-lg leading-relaxed">Experience therapy on your terms with tools designed to make your mental health journey easier.</p>
          <ul className="space-y-4">
            {['Flexible schedule options (evenings & weekends)', 'Secure, Private video and chat sessions', 'Access session history and personal notes', 'Switch counselors easily if needed'].map(li => (
              <li key={li} className="flex items-center gap-3 font-bold text-slate-700 text-sm italic">
                <CheckCircle2 className="text-[#0D9488]" size={18}/> {li}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. GROW YOUR PRACTICE (Counselor Section) */}
      <section id="counselor-section" className="py-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-16">
        <div className="flex-1">
          <img src={Image1} className="w-full rounded-[2rem] shadow-lg max-h-[350px] object-cover" alt="Counselor" />
        </div>
        <div className="flex-1 space-y-6 text-left">
          <span className="text-teal-500 font-bold text-[10px] uppercase tracking-widest">For Counselors</span>
          <h2 className="text-4xl font-black text-slate-900">Grow your practice online</h2>
          <p className="text-slate-500 text-lg leading-relaxed">Focus on your clients while we handle the admin and billing.</p>
         <ul className="space-y-4">
            {['Simple license verification process', 'Set your own availability and rates', 'Secure clinical notes management', 'Guaranteed bi-weekly payouts'].map(li => (
              <li key={li} className="flex items-center gap-3 font-bold text-slate-700 text-sm italic">
                <CheckCircle2 className="text-[#0D9488]" size={18}/> {li}
              </li>
            ))} </ul>
          <button onClick={() => navigate('/signup')} className="bg-[#0D9488] text-white px-8 py-4 rounded-xl font-bold shadow-lg">Apply as Counselor</button>
        </div>
      </section>

      {/* SECTION 6: Your Privacy is Our Priority */}
      <section id="privacy-section" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Your privacy is our priority</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">
              We adhere to the highest security standards to keep your data safe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <ShieldCheck className="text-[#0D9488]" />, title: 'Bank-grade Security', desc: 'State of the art encryption.' },
              { icon: <Lock className="text-[#0D9488]" />, title: 'HIPAA Compliant', desc: 'Strict data privacy standards.' },
              { icon: <EyeOff className="text-[#0D9488]" />, title: 'Privacy First', desc: 'Only you and your counselor.' },
              { icon: <CheckCircle className="text-[#0D9488]" />, title: 'Confidential', desc: '100% private conversations.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 text-center shadow-sm hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {item.icon}
                </div>
                <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: Stories from our Community */}
      <section id= "stories-section" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Stories from our community</h2>
            <p className="text-slate-500 font-medium">Real impact on real lives.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah M.', role: 'Client', text: 'MindConnect changed how I view therapy. Being able to talk from my couch made all the difference.' },
              { name: 'James L.', role: 'Client', text: 'The matching process was so simple. I found a counselor who truly understands my career stress.' },
              { name: 'David W.', role: 'Client', text: 'Secure, private, and professional. This platform is exactly what I was looking for.' }
            ].map((story, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 relative shadow-sm">
                <Quote className="absolute top-8 right-10 text-teal-50 opacity-50" size={60} />
                <div className="flex gap-1 text-orange-400 mb-6">
                  {[...Array(5)].map((_, s) => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p className="text-slate-600 text-lg italic mb-10 leading-relaxed relative z-10">
                  "{story.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-[#0D9488]">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">{story.name}</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{story.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;




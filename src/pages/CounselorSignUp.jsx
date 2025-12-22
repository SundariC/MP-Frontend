import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CounselorSignup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    specialization: '',
    password: '',
    price: '',
    bio: '',
    role: 'counselor' // Backend logic-ku idhu mukkiyam
  });

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/register', formData);
      toast.success("Application Sent! Please login to continue.");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200 w-full max-w-xl border border-slate-100">
        <div className="text-center mb-8">
          <span className="bg-teal-50 text-teal-600 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-teal-100">
             Verified Providers Only
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-4">Join as a Counselor</h2>
          <p className="text-slate-500 mt-2 text-sm px-10">
            Grow your private practice with flexible hours, secure tools, and guaranteed payouts.
          </p>
        </div>

        <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-black uppercase text-slate-600 mb-2">Legal First & Last Name</label>
            <input type="text" required placeholder="Enter your name"
              className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-teal-500 outline-none transition font-bold"
              onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-600 mb-2">Work Email</label>
            <input type="email" required placeholder="name@gmail.com"
              className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-teal-500 outline-none transition font-bold"
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-600 mb-2">Price per Session (₹)</label>
            <input type="number" required placeholder="Amount"
              className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-teal-500 outline-none transition font-bold"
              onChange={(e) => setFormData({...formData, price: e.target.value})} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-black uppercase text-slate-600 mb-2">Licensure Type / Specialization</label>
            <select className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-teal-500 outline-none transition font-bold text-slate-600"
              onChange={(e) => setFormData({...formData, specialization: e.target.value})}>
              <option value="">Select Specialization</option>
              <option value="Clinical Psychologist">Clinical Psychologist</option>
              <option value="Mental Health Counselor">Mental Health Counselor</option>
              <option value="Marriage & Family Therapist">Marriage & Family Therapist</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-black uppercase text-slate-600 mb-2">Password</label>
            <input type="password" required placeholder="Create a strong password"
              className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-teal-500 outline-none transition font-bold"
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          <button className="md:col-span-2 w-full bg-[#0D9488] hover:bg-[#0b7a6f] text-white font-black py-5 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1 mt-4">
            Start Application
          </button>
        </form>
        <p className="text-center mt-6 font-bold text-slate-600">
          Already have a counselor account? 
          <span onClick={() => navigate('/login')} className="text-teal-600 cursor-pointer ml-2 hover:underline">
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default CounselorSignup;
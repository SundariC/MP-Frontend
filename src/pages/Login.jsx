import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext"; // ✅ AuthContext import panniyachu

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', formData);
    
      login(res.data.user, res.data.token);

      toast.success("Login Successful! Welcome back.");

      if (res.data.user.role === "counselor") {
        navigate('/counselor-dashboard');
      } else {
        navigate('/client-dashboard');
      }

    } catch (err) {
      console.error("Login Error:", err);
      toast.error(err.response?.data?.message || "Invalid Email or Password!");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200 w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Log in to continue your journey.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition"
              placeholder="name@example.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input 
              type="password" required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition"
              placeholder="Enter your password"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-100 transition-all transform hover:-translate-y-1">
            Log In
          </button>
        </form>
        
        <p className="text-center mt-6 text-slate-600 text-sm">
          Don't have an account? <span onClick={() => navigate('/signup')} className="text-teal-600 font-bold cursor-pointer hover:underline">Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
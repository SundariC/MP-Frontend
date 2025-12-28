import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from "../services/api";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      
      // ✅ Token and User data-ah localStorage-la save pannunga
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      toast.success(`Welcome back, ${res.data.user.fullName}!`);

      // ✅ Role-ku yethapadi redirect
      if (res.data.user.role === 'client') {
        navigate('/client-dashboard');
      } else {
        navigate('/counselor-dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-black mb-6 text-center">Login</h2>
        <input 
          type="email" placeholder="Email" required
          className="w-full p-4 mb-4 border rounded-2xl outline-none focus:ring-2 focus:ring-teal-500"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Password" required
          className="w-full p-4 mb-6 border rounded-2xl outline-none focus:ring-2 focus:ring-teal-500"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-teal-600 text-white font-bold py-4 rounded-2xl hover:bg-teal-700 transition">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ClientSignUp = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/auth/register', formData);
            toast.success("Account Created Successfully!");
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong!");
        }
    }
    return (
            <div className = "min-h-[80vh] flex items-center justify-center px-6">
                <div className= "bg-white p-8 rounder-3xl shadow-2xl shadow-slate-200 w-full max-w-md border border-slate-100">
                    <div className= "text-center mb-8">
                        <h2 className= "text-3xl front-black text-slate-900">Join MindConnect</h2>
                        <p className= "text-slate-500 mt-2">Start your wellness journey today.</p>
                    </div>
                    <form onSubmit= {handleSignup} className= "space-y-5">
                        <div>
                            <label className= "block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                            <input 
                            type= "text" 
                            className= "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition"
                            placeholder= "Enter your name"
                            onChange= {(e) => setFormData({...formData, fullName: e.target.value})}/>
                        </div>
                        <div>
                        <label className= "block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                        <input 
                            type= "email" required 
                            className= "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-real-500 outline-none transition"
                            placeholder= "name@example.com"
                            onChange= {(e) => setFormData({...formData, email:e.target.value})}/>
                        </div>
                        <div>
                        <label className= "block text-sm font-bold text-slate-700 mb-2">Password</label>
                        <input 
                            type= "password" required 
                            className= "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-real-500 outline-none transition"
                            placeholder= "Create a strong password"
                            onChange= {(e) => setFormData({...formData, password:e.target.value})}/>
                        </div>
                        <button className= "w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-100 transition-all transform hover:-translate-y-1">
                            Create Account
                        </button>
                    </form>
                    <p className = "text-center mt-6 text-slate-600 text-sm">
                        Already have an account? <span onClick={() => navigate('/login')} className= "text-teal-600 font-bold cursor-pointer hover:underline">Login</span>
                    </p>
                </div>
            </div>
    );
};

export default ClientSignUp;
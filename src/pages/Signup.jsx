import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

const Signup = () => {
  const [role, setRole] = useState("client");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(""); 
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    specialization: "", 
  });

  const navigate = useNavigate();

  //   const handleSignup = async (e) => {
  //     e.preventDefault();
  //     try {
  //       // Role-ah formData kooda add pandrom
  //       const dataToSend = { ...formData, role };

  //       const res = await API.post('/auth/register', dataToSend);
  //       toast.success("Registration Successful! Please Login.");
  //       navigate('/login');
  //     } catch (err) {
  //       toast.error(err.response?.data?.message || "Registration Failed!");
  //     }
  //   };
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        role,
        price: role === "counselor" ? 500 : 0,
        services: role === "counselor" ? [] : [],
        availability: role === "counselor" ? [] : [],
      };

      const res = await API.post("/auth/register", dataToSend);
      const userType = dataToSend.role === "client" ? "Client" : "Counselor";
    toast.success(`${userType} Registered Successfully!`);
    } catch (err) {
      console.error("Signup Error Details:", err.response?.data);
      toast.error(err.response?.data?.message || "Registration Failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900">Create Account</h2>
          <p className="text-slate-500 mt-2">Join us as a {role}.</p>
        </div>

        {/* Role Selection Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => setRole("client")}
            className={`flex-1 py-2 rounded-lg font-bold transition ${
              role === "client"
                ? "bg-white shadow text-teal-600"
                : "text-slate-500"
            }`}
          >
            Client
          </button>
          <button
            onClick={() => setRole("counselor")}
            className={`flex-1 py-2 rounded-lg font-bold transition ${
              role === "counselor"
                ? "bg-white shadow text-teal-600"
                : "text-slate-500"
            }`}
          >
            Counselor
          </button>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500"
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-teal-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-teal-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {role === "counselor" && (
            <input
              type="text"
              placeholder="Specialization (e.g. Career, Mental Health)"
              required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) =>
                setFormData({ ...formData, specialization: e.target.value })
              }
            />
          )}

          <button
            type="submit"
            className="w-full bg-teal-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-teal-700 transition"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-6 text-slate-600 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-teal-600 font-bold cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;

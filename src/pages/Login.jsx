import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      
      if (res.data && res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      login(res.data.user, res.data.token);

      toast.success(`Welcome back, ${res.data.user.fullName}!`);

      if (res.data.user.role === "client") {
        navigate("/client-dashboard");
      } else {
        navigate("/counselor-dashboard");
      }  
    }                                   
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed!");
    }
  };
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await API.post("/auth/login", { email, password });
      
  //     // Console-la check panni paarunga enna data varuthu nu
  //     console.log("Backend Data:", res.data);

  //     if (res.data && res.data.token) {
  //       const token = res.data.token;
        
  //       // Backend 'user' object-ah anupala naalum error varama irukka:
  //       const userData = res.data.user || { 
  //         role: res.data.role, 
  //         fullName: "User", // Default name
  //         id: res.data.id 
  //       };

  //       localStorage.setItem("token", token);
  //       localStorage.setItem("user", JSON.stringify(userData));
        
  //       // Context login call
  //       login(userData, token);

  //       toast.success(`Welcome back!`);

  //       // Redirect logic using the safer variable
  //       if (userData.role === "client") {
  //         navigate("/client-dashboard");
  //       } else {
  //         navigate("/counselor-dashboard");
  //       }   
  //     }                                     
  //   } catch (err) {
  //     console.error("Login catch error:", err);
  //     toast.error(err.response?.data?.message || "Login Failed!");
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-black mb-6 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full p-4 mb-4 border rounded-2xl outline-none focus:ring-2 focus:ring-teal-500"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 ml-1">
            Password
          </label>
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
        </div>
        <button
          type="submit"
          className="w-full mt-5 bg-teal-600 text-white font-bold py-4 rounded-2xl hover:bg-teal-700 transition"
        >
          Sign In
        </button>
         <p className="text-center mt-6 text-slate-600 text-sm">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-teal-600 font-bold cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;

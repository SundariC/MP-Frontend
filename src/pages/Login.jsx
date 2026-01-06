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

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await API.post("/auth/login", { email, password });
      
  //     if (res.data && res.data.token) {
  //     localStorage.setItem("token", res.data.token);
  //     localStorage.setItem("user", JSON.stringify(res.data.user));
  //     login(res.data.user, res.data.token);

  //     toast.success(`Welcome back, ${res.data.user.fullName}!`);

  //     if (res.data.user.role === "client") {
  //       navigate("/client-dashboard");
  //     } else {
  //       navigate("/counselor-dashboard");
  //     }  
  //   }                                   
  //   } catch (err) {
  //     console.log(err);
  //     toast.error(err.response?.data?.message || "Login Failed!");
  //   }
  // };
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post("/auth/login", { email, password });
    
    // Step 1: Backend response check
    console.log("Login Response:", res.data); 

    if (res.data && res.data.token) {
      const user = res.data.user;
      const token = res.data.token;

      // Step 2: Storage logic
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Step 3: Global State update
      login(user, token); 

      toast.success(`Welcome back, ${user.fullName}!`);

      // Step 4: Role-based Navigation
      if (user.role === "client") {
        navigate("/client-dashboard");
      } else {
        navigate("/counselor-dashboard");
      }
    }
  } catch (err) {
    console.error("Login Error Details:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Login Failed!");
  }
};

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

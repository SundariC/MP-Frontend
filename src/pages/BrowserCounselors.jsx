import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search, Star, MapPin, Briefcase } from "lucide-react";

// ✅ 1. Mock data-va thookiyachu (Outside the function is fine)

const BrowserCounselor = () => {
  // ✅ 2. ELLA HOOKS-um FUNCTION-KULLA DHAAN IRUKANUM
  const navigate = useNavigate();
  const [allCounselors, setAllCounselors] = useState([]); // Intha line function-ku veliya iruntha dhaan neenga sonna error varum
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/counselors");
        
        // Backend data format-ku thagundha mari map panrom
        const formattedReal = (res.data || []).map((doc) => ({
          _id: doc._id,
          fullName: doc.fullName || "Unnamed Counselor",
          specialization: doc.specialization || "General Counseling",
          price: doc.price || 500,
          rating: doc.rating || 4.5,
          experience: doc.experience || "0",
          location: doc.location || "Online",
          bio: doc.bio || "Professional counselor available for sessions.",
          image: doc.image || `https://ui-avatars.com/api/?name=${doc.fullName || "Counselor"}&background=0D9488&color=fff`,
        }));

        setAllCounselors(formattedReal);
      } catch (error) {
        console.error("Error fetching counselors:", error);
      }
    };
    fetchCounselors();
  }, []);

  const filteredCounselors = allCounselors.filter((c) => {
    const name = String(c?.fullName || "").toLowerCase();
    const specialization = String(c?.specialization || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || specialization.includes(search);
  });

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto bg-[#F8FAFC] min-h-screen">
      {/* ... (Unga design components ellaam inga thodarum) ... */}
      <h1 className="text-4xl font-black text-slate-900 mb-8 text-center">Meet Our Experts</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCounselors.map((doc) => (
          <div key={doc._id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all">
            <img src={doc.image} className="w-20 h-20 rounded-2xl mb-4 shadow-lg shadow-teal-50" alt={doc.fullName} />
            <h3 className="text-xl font-black text-slate-800">{doc.fullName}</h3>
            <p className="text-teal-600 font-bold text-xs uppercase mb-3">{doc.specialization}</p>
            <p className="text-slate-500 text-sm mb-6 line-clamp-2 italic leading-relaxed">"{doc.bio}"</p>
            
            <div className="flex justify-between items-center border-t pt-4">
              <p className="text-xl font-black text-slate-900">₹{doc.price}</p>
              <button
                onClick={() => navigate("/checkoutPage", { state: { counselor: doc } })}
                className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase hover:bg-teal-600 transition"
              >
                Book Session
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowserCounselor;
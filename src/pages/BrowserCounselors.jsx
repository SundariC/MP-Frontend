

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search, Star } from "lucide-react";

const mockCounselors = [
  {
    _id: "mock1",
    fullName: "Dr. Sarah Jenkins",
    specialization: "Anxiety & Depression",
    price: 80,
    rating: 4.9,
    image: "https://i.pravatar.cc/150?u=sarah",
    bio: "Expert in cognitive behavioral therapy with 10+ years experience.",
    isMock: true,
  },
  {
    _id: "mock2",
    fullName: "Dr. Michael Ross",
    specialization: "Relationship Coach",
    price: 95,
    rating: 4.8,
    image: "https://i.pravatar.cc/150?u=michael",
    bio: "Helping couples build stronger bonds and better communication.",
    isMock: true,
  },
  {
    _id: "mock3",
    fullName: "Dr. Anita Nair",
    specialization: "Career Counseling",
    price: 70,
    rating: 4.7,
    image: "https://i.pravatar.cc/150?u=anita",
    bio: "Specialized in professional growth and workplace stress management.",
    isMock: true,
  },
  {
    _id: "mock4",
    fullName: "Dr. David Miller",
    specialization: "Child Psychology",
    price: 110,
    rating: 5.0,
    image: "https://i.pravatar.cc/150?u=david",
    bio: "Supporting children and adolescents through emotional challenges.",
    isMock: true,
  },
  {
    _id: "mock5",
    fullName: "Dr. Priya Sharma",
    specialization: "Stress Management",
    price: 65,
    rating: 4.6,
    image: "https://i.pravatar.cc/150?u=priya",
    bio: "Mindfulness and meditation expert for busy professionals.",
    isMock: true,
  },
  {
    _id: "mock6",
    fullName: "Dr. Robert Wilson",
    specialization: "Trauma Specialist",
    price: 120,
    rating: 4.9,
    image: "https://i.pravatar.cc/150?u=robert",
    bio: "Compassionate care for PTSD and trauma recovery.",
    isMock: true,
  },
  {
    _id: "mock7",
    fullName: "Dr. Kavita Reddy",
    specialization: "Marriage Counselor",
    price: 90,
    rating: 4.8,
    image: "https://i.pravatar.cc/150?u=kavita",
    bio: "Resolving family conflicts and strengthening marital relationships.",
    isMock: true,
  },
  {
    _id: "mock8",
    fullName: "Dr. James Bond",
    specialization: "Addiction Specialist",
    price: 100,
    rating: 4.7,
    image: "https://i.pravatar.cc/150?u=james",
    bio: "Helping individuals overcome substance abuse and behavioral addictions.",
    isMock: true,
  },
  {
    _id: "mock9",
    fullName: "Dr. Sophie Turner",
    specialization: "Eating Disorders",
    price: 85,
    rating: 4.5,
    image: "https://i.pravatar.cc/150?u=sophie",
    bio: "Specialized support for body positivity and healthy eating habits.",
    isMock: true,
  },
  {
    _id: "mock10",
    fullName: "Dr. Arun Kumar",
    specialization: "Grief & Loss",
    price: 75,
    rating: 4.8,
    image: "https://i.pravatar.cc/150?u=arun",
    bio: "Providing a safe space to navigate the journey of loss and mourning.",
    isMock: true,
  },
];

const BrowserCounselor = () => {
  const navigate = useNavigate();
  const [allCounselors, setAllCounselors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/auth/counselors"
        );

        const formattedReal = (res.data || []).map((doc) => ({
          _id: doc._id,
          fullName: doc.fullName || "Unnamed Counselor",
          specialization: doc.specialization || "General Counseling",
          price: doc.price || 500,
          rating: doc.rating || 4.5,
          bio:
            doc.bio ||
            "Professional licensed counselor available for sessions.",
          image:
            doc.image ||
            `https://ui-avatars.com/api/?name=${doc.fullName || "Counselor"}&background=0D9488&color=fff`,
          isMock: false,
        }));

        setAllCounselors([...formattedReal, ...mockCounselors]);
      } catch (error) {
        console.error("Error fetching counselors:", error);
        setAllCounselors(mockCounselors);
      }
    };

    fetchCounselors();
  }, []);

  // ✅ SAFE FILTER (NO toLowerCase ERROR)
  const filteredCounselors = allCounselors.filter((c) => {
    const name = String(c?.fullName || "").toLowerCase();
    const specialization = String(c?.specialization || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return (
      name.includes(search) || specialization.includes(search)
    );
  });

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto bg-[#F8FAFC] min-h-screen">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-4">
          Find Your Perfect Match
        </h1>
        <p className="text-slate-500 mb-8">
          Search from our curated list of professional counselors.
        </p>

        <div className="relative max-w-2xl mx-auto">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            size={22}
          />
          <input
            type="text"
            value={searchTerm}
            placeholder="Search by name, specialization..."
            className="w-full pl-14 pr-6 py-5 bg-white shadow-xl rounded-[2rem]"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCounselors.length === 0 && (
          <p className="col-span-full text-center text-slate-500">
            No counselors found
          </p>
        )}

        {filteredCounselors.map((doc) => (
          <div
            key={doc._id}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition"
          >
            <img
              src={doc.image}
              className="w-24 h-24 rounded-3xl object-cover mb-6"
              alt={doc.fullName}
            />

            <div className="flex justify-between mb-2">
              <h3 className="text-2xl font-bold">{doc.fullName}</h3>
              <span className="flex items-center gap-1 text-orange-400 font-bold">
                <Star size={16} fill="currentColor" /> {doc.rating}
              </span>
            </div>

            <p className="text-teal-600 font-bold mb-3">
              {doc.specialization}
            </p>

            <p className="text-slate-500 text-sm mb-6">{doc.bio}</p>

            <div className="flex justify-between items-center border-t pt-4">
              <p className="text-xl font-black">₹{doc.price}/hr</p>

              {doc.isMock ? (
                <button
                  disabled
                  className="px-6 py-3 bg-gray-300 text-gray-600 rounded-xl font-bold cursor-not-allowed"
                >
                  Demo Only
                </button>
              ) : (
                <button
                  onClick={() =>
                    navigate("/checkoutPage", { state: { counselor: doc } })
                  }
                  className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold"
                >
                  Book Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowserCounselor;





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Star, MapPin, Clock, X, Calendar,  } from 'lucide-react';

const mockCounselors = [
  { _id: "mock1", fullName: "Dr. Sarah Jenkins", specialization: "Anxiety & Depression", price: 80, rating: 4.9, image: "https://i.pravatar.cc/150?u=sarah", bio: "Expert in cognitive behavioral therapy with 10+ years experience." },
  { _id: "mock2", fullName: "Dr. Michael Ross", specialization: "Relationship Coach", price: 95, rating: 4.8, image: "https://i.pravatar.cc/150?u=michael", bio: "Helping couples build stronger bonds and better communication." },
  { _id: "mock3", fullName: "Dr. Anita Nair", specialization: "Career Counseling", price: 70, rating: 4.7, image: "https://i.pravatar.cc/150?u=anita", bio: "Specialized in professional growth and workplace stress management." },
  { _id: "mock4", fullName: "Dr. David Miller", specialization: "Child Psychology", price: 110, rating: 5.0, image: "https://i.pravatar.cc/150?u=david", bio: "Supporting children and adolescents through emotional challenges." },
  { _id: "mock5", fullName: "Dr. Priya Sharma", specialization: "Stress Management", price: 65, rating: 4.6, image: "https://i.pravatar.cc/150?u=priya", bio: "Mindfulness and meditation expert for busy professionals." },
  { _id: "mock6", fullName: "Dr. Robert Wilson", specialization: "Trauma Specialist", price: 120, rating: 4.9, image: "https://i.pravatar.cc/150?u=robert", bio: "Compassionate care for PTSD and trauma recovery." },
  { _id: "mock7", fullName: "Dr. Kavita Reddy", specialization: "Marriage Counselor", price: 90, rating: 4.8, image: "https://i.pravatar.cc/150?u=kavita", bio: "Resolving family conflicts and strengthening marital relationships." },
  { _id: "mock8", fullName: "Dr. James Bond", specialization: "Addiction Specialist", price: 100, rating: 4.7, image: "https://i.pravatar.cc/150?u=james", bio: "Helping individuals overcome substance abuse and behavioral addictions." },
  { _id: "mock9", fullName: "Dr. Sophie Turner", specialization: "Eating Disorders", price: 85, rating: 4.5, image: "https://i.pravatar.cc/150?u=sophie", bio: "Specialized support for body positivity and healthy eating habits." },
  { _id: "mock10", fullName: "Dr. Arun Kumar", specialization: "Grief & Loss", price: 75, rating: 4.8, image: "https://i.pravatar.cc/150?u=arun", bio: "Providing a safe space to navigate the journey of loss and mourning." }
];

const BrowserCounselor = () => {
  const navigate = useNavigate();
  const [allCounselors, setAllCounselors] = useState(mockCounselors);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCounselor, setSelectedCounselor] = useState(null); // Modal open/close-ku
  const [bookingDate, setBookingDate] = useState("");
  const [sessionType, setSessionType] = useState("Video Session");

  useEffect(() => {
    const fetchRealCounselors = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/auth/counselors');
        setAllCounselors([...mockCounselors, ...res.data]);
      } catch (err) {
        console.log("error fetching counselors");
      }
    };
    fetchRealCounselors();
  }, []);

  // --- BOOKING HANDLER ---
  const handleConfirmBooking = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!user) return alert("Please login to book!");
    if (!bookingDate) return alert("Please select a date!");

    // UNGA BACKEND SCHEMA-PADI DATA:
    const bookingData = {
      client: user.id, // Backend-la client-nu schema vachirukeenga
      counselor: selectedCounselor._id, // Counselor ID
      sessionType: sessionType,
      appointmentDate: bookingDate,
      status: "pending",
      isPaid: false
    };

    try {
      // BACKEND API CALL:
      const res = await axios.post('http://localhost:3000/api/bookings/create', bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Booking Successful! Go to Dashboard to check.");
      setSelectedCounselor(null); // Modal close pannum
      navigate('/dashboard'); 
    } catch (err) {
      console.error(err);
      alert("Booking failed. Make sure backend is running.");
    }
  };
  
  const filteredCounselors = allCounselors.filter(c => 
    c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto bg-[#F8FAFC] min-h-screen">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Find Your Perfect Match</h1>
        <p className="text-slate-500 mb-8">Search from our curated list of professional licensed counselors.</p>
        
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22}/>
          <input 
            type="text" 
            placeholder="Search by name, specialization (e.g. Anxiety)..." 
            className="w-full pl-14 pr-6 py-5 bg-white border-none shadow-xl shadow-slate-100 rounded-[2rem] focus:ring-2 focus:ring-teal-500 outline-none transition text-lg"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCounselors.length > 0 ? (
          filteredCounselors.map((doc) => (
            <div key={doc._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="relative mb-6">
                <img src={doc.image} className="w-24 h-24 rounded-3xl object-cover shadow-lg" alt={doc.fullName} />
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 border-4 border-white rounded-full"></div>
              </div>

              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{doc.fullName}</h3>
                <span className="flex items-center gap-1 text-orange-400 font-bold bg-orange-50 px-3 py-1 rounded-full text-sm">
                  <Star size={16} fill="currentColor"/> {doc.rating}
                </span>
              </div>

              <p className="text-teal-600 font-bold text-sm mb-4 bg-teal-50 inline-block px-3 py-1 rounded-lg">{doc.specialization}</p>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed line-clamp-2">{doc.bio}</p>
              
              <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Session Fee</p>
                  <p className="text-2xl font-black text-slate-800">${doc.price}<span className="text-sm font-normal text-slate-400">/hr</span></p>
                </div>
                <button
                onClick={() => setSelectedCounselor(doc)} 
                className="px-8 py-4 bg-teal-600 text-white rounded-2xl font-bold text-sm hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all active:scale-95">
                  Book Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-slate-400 text-lg">No counselors found matching your search.</p>
          </div>
        )}
      </div>
      {selectedCounselor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative animate-in zoom-in duration-200">
            
            <button 
              onClick={() => setSelectedCounselor(null)} 
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition"
            >
              {/* <X size={20}/> */}
            </button>

            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900">Confirm Booking</h2>
              <p className="text-teal-600 font-bold">with {selectedCounselor.fullName}</p>
            </div>

            <div className="space-y-6">
              {/* DATE PICKER */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Appointment Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                  <input 
                    type="date" 
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-teal-500 transition font-bold text-slate-700"
                  />
                </div>
              </div>

              {/* SESSION TYPE */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Session Type</label>
                <div className="relative">
                  <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                  <select 
                    onChange={(e) => setSessionType(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-teal-500 transition font-bold text-slate-700 appearance-none"
                  >
                    <option>Video Session</option>
                    <option>Voice Call</option>
                    <option>Chat Session</option>
                  </select>
                </div>
              </div>

              {/* PRICE SUMMARY */}
              <div className="p-6 bg-teal-50 rounded-3xl flex justify-between items-center">
                <span className="text-teal-700 font-bold">Consultation Fee</span>
                <span className="text-2xl font-black text-slate-900">${selectedCounselor.price}</span>
              </div>
            </div>

            <button 
              onClick={handleConfirmBooking}
              className="w-full mt-8 py-5 bg-teal-600 text-white font-black rounded-2xl shadow-xl shadow-teal-100 hover:bg-teal-700 transition active:scale-95"
            >
              Confirm Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowserCounselor;
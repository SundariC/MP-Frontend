// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { 
//   ShieldCheck, ArrowLeft, Star, Award, BookOpen, Users, Calendar, Clock 
// } from "lucide-react";

// const CheckoutPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { counselor } = location.state || {};
//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = localStorage.getItem("token");

//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     if (!counselor) {
//       console.error("Counselor data missing in state!");
//     }
//   }, [counselor]);

//   if (!counselor) {
//     return (
//       <div className="pt-40 text-center">
//         <h2 className="text-xl font-bold">No counselor data found</h2>
//         <button onClick={() => navigate("/browser")} className="text-teal-600 underline mt-4 font-bold">
//           Go back to Browse
//         </button>
//       </div>
//     );
//   }

//   const handleRazorpayPayment = async () => {
//     if (!user || !token) {
//       alert("Please login to continue payment");
//       return navigate("/login");
//     }

//     if (!selectedDate || !selectedTime) {
//       alert("Please select both Date and Time!");
//       return;
//     }

//     setLoading(true);

//     try {
//       // 1. Create Order in Backend
//       const baseAmount = parseInt(counselor.price || counselor.fees || 500);
//       const totalAmount = baseAmount + 50; 

//       const orderRes = await axios.post(
//         "http://localhost:3000/api/bookings/create-order",
//         { amount: totalAmount },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const { order, key } = orderRes.data;

//       if (!window.Razorpay) {
//         alert("Razorpay SDK not loaded. Please refresh the page.");
//         setLoading(false);
//         return;
//       }

//       // 2. Razorpay Options
//       const options = {
//         key: key,
//         amount: order.amount, 
//         currency: "INR",
//         name: "MindCare",
//         description: `Booking with ${counselor.fullName}`,
//         order_id: order.id,
//         handler: async function (response) {
//           try {
//             await axios.post(
//               "http://localhost:3000/api/bookings/book",
//               {
//                 counselorId: counselor._id,
//                 appointmentDate: selectedDate,
//                 timeSlot: selectedTime,
//                 paymentId: response.razorpay_payment_id,
//                 amountPaid: totalAmount
//               },
//               { headers: { Authorization: `Bearer ${token}` } }
//             );
//             alert("Booking Successfully Confirmed!");
//             navigate("/client-dashboard");
//           } catch (bookErr) {
//             console.error("Booking Finalize Error:", bookErr.response?.data || bookErr);
//             alert("Payment success, but booking update failed. Contact Support.");
//           }
//         },
//         prefill: {
//           name: user.fullName || user.name,
//           email: user.email,
//         },
//         theme: { color: "#0D9488" },
//         modal: {
//           ondismiss: function() { setLoading(false); }
//         }
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();

//     } catch (err) {
//       console.error("Payment Process Error:", err.response?.data || err.message);
//       alert("Something went wrong with the payment process. Check console.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 pt-15 pb-12 px-6">
//       <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 pt-10">
        
//         {/* LEFT SIDE: Details */}
//         <div className="flex-[2] space-y-6">
//           <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold text-sm">
//             <ArrowLeft size={16} /> Back to Browse
//           </button>

//           <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
//             <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b">
//               <img
//                 src={counselor.image || counselor.profileImage || `https://ui-avatars.com/api/?name=${counselor.fullName}&background=0D9488&color=fff`}
//                 className="w-32 h-32 rounded-3xl object-cover shadow-md border-4 border-white"
//                 alt="Counselor"
//               />
//               <div className="flex-1">
//                 <h2 className="text-3xl font-black text-slate-900">{counselor.fullName}</h2>
//                 <p className="text-[#0D9488] font-bold uppercase tracking-widest text-xs mt-1">
//                   {counselor.specialization || counselor.speciality}
//                 </p>
//                 <div className="flex gap-4 mt-4">
//                   <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border">
//                     <Star size={14} className="text-orange-400" fill="currentColor"/> 4.9
//                   </span>
//                   <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border">
//                     <Award size={14} className="text-teal-600"/> {counselor.experience || '8'}+ Yrs Exp
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="mb-10 bg-slate-50 p-6 rounded-2xl">
//               <h3 className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2 text-slate-400">
//                 <BookOpen size={16} className="text-[#0D9488]" /> About Counselor
//               </h3>
//               <p className="text-slate-600 text-sm leading-relaxed font-medium">
//                 {counselor.bio || counselor.summary || "Highly experienced professional providing compassionate mental health support and personalized counseling sessions."}
//               </p>
//             </div>

//             <div className="grid md:grid-cols-2 gap-8">
//               <div>
//                 <label className="text-xs font-black uppercase mb-3 block text-slate-400 flex items-center gap-2">
//                   <Calendar size={14}/> Select Date
//                 </label>
//                 <input
//                   type="date"
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                   className="w-full p-4 rounded-2xl border-2 border-slate-50 bg-slate-50 font-bold outline-none focus:border-[#0D9488]"
//                 />
//               </div>
//               <div>
//                 <label className="text-xs font-black uppercase mb-3 block text-slate-400 flex items-center gap-2">
//                   <Clock size={14}/> Select Slot
//                 </label>
//                 <div className="grid grid-cols-2 gap-2">
//                   {["10:00 AM", "02:00 PM", "04:00 PM", "06:00 PM"].map((slot) => (
//                     <button
//                       key={slot}
//                       onClick={() => setSelectedTime(slot)}
//                       className={`p-3 rounded-xl border-2 font-bold text-xs transition-all ${
//                         selectedTime === slot ? "border-[#0D9488] bg-teal-50 text-[#0D9488]" : "bg-white border-slate-100 text-slate-400"
//                       }`}
//                     >
//                       {slot}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT SIDE: Summary */}
//         <div className="lg:w-[380px]">
//           <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 sticky top-28">
//             <h4 className="font-black text-slate-900 mb-6 uppercase text-[10px] tracking-widest border-b pb-4">Payment Details</h4>
//             <div className="space-y-4 mb-8">
//               <div className="flex justify-between text-sm font-bold text-slate-500">
//                 <span>Session Fee</span>
//                 <span>₹{counselor.price || counselor.fees || 500}</span>
//               </div>
//               <div className="flex justify-between text-sm font-bold text-slate-500">
//                 <span>Platform Fee</span>
//                 <span>₹50</span>
//               </div>
//               <div className="pt-4 border-t flex justify-between items-center">
//                 <span className="font-black text-slate-900">Total Amount</span>
//                 <span className="font-black text-2xl text-[#0D9488]">
//                   ₹{parseInt(counselor.price || counselor.fees || 500) + 50}
//                 </span>
//               </div>
//             </div>

//             <button
//               onClick={handleRazorpayPayment}
//               disabled={loading}
//               className={`w-full py-5 rounded-2xl font-black text-white shadow-lg transition-all ${
//                 loading ? "bg-slate-300 cursor-not-allowed" : "bg-[#0D9488] hover:bg-[#0b7a6f]"
//               }`}
//             >
//               {loading ? "Processing..." : "Pay Now (Razorpay)"}
//             </button>

//             <p className="text-[10px] text-center mt-4 text-slate-400 font-bold uppercase flex items-center justify-center gap-1">
//               <ShieldCheck size={14} className="text-green-500" /> Secure SSL Checkout
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;
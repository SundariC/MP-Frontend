import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api'; // API service
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

const CheckoutPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const counselor = location.state?.counselor; 
  
  const [bookingData, setBookingData] = useState({
    appointmentDate: '',
    timeSlot: ''
  });

  const handleBooking = async () => {
    if (!bookingData.appointmentDate || !bookingData.timeSlot) {
      return toast.warning("Please select date and time");
    }

    try {
      // 1. Create Order on Backend
      const orderRes = await API.post('/bookings/create-order', {
        amount: Number(counselor.price) 
      });

      const { amount, id: order_id, currency } = orderRes.data.order;

      // 2. Razorpay Options
      const options = {
        key: orderRes.data.key,
        amount: amount,
        currency: currency,
        name: "MindEase Counseling",
        description: `Booking with ${counselor.fullName}`,
        order_id: order_id,
        handler: async function (response) {
          try {
            // SAFE ID EXTRACTION: Ithu thaan expert list matrum dashboard rendu pakkamum work aaga vaikkum
            const finalId = counselor?._id || counselor?.id;

            // 3. Verify Payment & Create Booking Record on Backend
            await API.post('/bookings/create', {
              counselor: finalId, // Correct counselor ID key  
              appointmentDate: bookingData.appointmentDate,
              timeSlot: bookingData.timeSlot,
              amount: counselor.price,
              sessionType: "mental",  
              paymentId: response.razorpay_payment_id  
            });

            toast.success("Payment Successful & Booking Confirmed!");
            navigate('/client-dashboard');
          } catch (err) {
            console.error("Verification error:", err.response?.data);
            toast.error("Booking record failed, but payment done. Contact support.");
          }
        },
        prefill: {
          name: user?.fullName,
          email: user?.email,
        },
        theme: { color: "#0D9488" },  
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Booking failed. Server Not connected.");
    }
  };

  if (!counselor) return <p className="pt-32 text-center">No counselor selected.</p>;

  return (
    <div className="pt-20 pb-20 px-6 max-w-4xl mx-auto min-h-screen bg-[#F8FAFC]">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-teal-600">
        <ArrowLeft size={18}/> Back to Counselors
      </button>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left: Counselor Card */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm h-fit">
          <img src={counselor.image} className="w-24 h-24 rounded-3xl mb-4" alt={counselor.fullName} />
          <h2 className="text-xl font-black text-slate-800">{counselor.fullName}</h2>
          <p className="text-teal-600 font-bold text-xs uppercase mb-4">{counselor.specialization}</p>
          <div className="border-t pt-4">
            <p className="text-xs font-black text-slate-400 uppercase">Total Fee</p>
            <p className="text-2xl font-black text-slate-900">₹{counselor.price}</p>
          </div>
        </div>

        {/* Right: Date & Time Selection */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-teal-600"/> Select Appointment Date
            </h3>
            <input 
              type="date" 
              // Past dates block panna min logic sethurukaen
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-4 bg-slate-50 border rounded-2xl outline-none"
              onChange={(e) => setBookingData({...bookingData, appointmentDate: e.target.value})}
            />
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <Clock size={20} className="text-teal-600"/> Select Time Slot
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'].map(slot => (
                <button 
                  key={slot}
                  type="button"
                  onClick={() => setBookingData({...bookingData, timeSlot: slot})}
                  className={`p-3 rounded-xl font-bold text-xs border transition-all ${bookingData.timeSlot === slot ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-100 hover:border-teal-200'}`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleBooking}
            className="w-full bg-teal-600 text-white py-5 rounded-[2rem] font-black text-sm shadow-xl shadow-teal-100 hover:bg-teal-700 transition"
          >
            CONFIRM BOOKING REQUEST
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
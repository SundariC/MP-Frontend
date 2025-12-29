import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Save, FileText, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const SessionNotes = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const token = localStorage.getItem('token');

 const handleSaveNotes = async () => {
  if (!notes.trim()) {
    toast.warning("Please write something before saving.");
    return;
  }

  try {
  
    await axios.post('https://mp-backend-1-82km.onrender.com/api/session/create', {
      bookingId: bookingId,
      sessionNotes: notes
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

  
    await axios.put(`https://mp-backend-1-82km.onrender.com/api/bookings/update-status`, {
      bookingId: bookingId,
      sessionStatus: "COMPLETED"
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    toast.success("Notes saved and Session Completed!");
    navigate('/counselor-dashboard'); 
  } catch (err) {
    console.error("Save Error:", err);
    toast.error("Failed to complete session");
  }
};

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm p-8">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-slate-500 font-bold italic">
          <ArrowLeft size={18} /> BACK
        </button>
        
        <div className="flex items-center gap-3 mb-8">
          <FileText className="text-teal-600" size={28} />
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">Session Notes</h1>
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write your observation about this session..."
          className="w-full h-64 p-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-400 font-medium italic transition-all"
        />

        <button 
          onClick={handleSaveNotes}
          className="w-full mt-6 bg-teal-600 text-white py-4 rounded-2xl font-black italic shadow-lg shadow-teal-100 flex items-center justify-center gap-2 hover:bg-teal-700 transition-all"
        >
          <Save size={20} /> SAVE NOTES
        </button>
      </div>
    </div>
  );
};

export default SessionNotes;
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VideoCall = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-slate-900 flex flex-col">
      <div className="p-4 flex justify-between items-center text-white">
        <h2 className="font-bold">Secure Counseling Session</h2>
        <button onClick={() => navigate(-1)} className="bg-red-500 px-4 py-2 rounded-lg font-bold">End Session</button>
      </div>
      
      {/* Iframe for Video Call */}
      <iframe
        src={`https://meet.jit.si/MindConnect_Session_${sessionId}`}
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        className="flex-grow w-full border-none"
      ></iframe>
    </div>
  );
};

export default VideoCall;
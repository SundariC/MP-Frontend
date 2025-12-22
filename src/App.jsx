import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import ClientSignUp from './pages/ClientSignUp';
import ClientDashboard from './pages/ClientDashboard';
import BrowserCounselors from './pages/BrowserCounselors';
import CounselorSignup from './pages/CounselorSignUp';
import CheckoutPage from "./pages/CheckoutPage";
import CounselorDashboard from './pages/CounselorDashboard';
import ChatPage from './pages/ChatPage';
import VideoCall from './pages/VideoCall';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} />
        
        <main className="flex-grow pt-20">
          <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/login" element={<Login />} />
             <Route path="/signup" element={<ClientSignUp />} />
             <Route path="/counselor-signup" element={<CounselorSignup />} />
             <Route path="/client-dashboard" element={<ClientDashboard />} />
             <Route path="/counselor-dashboard" element={<CounselorDashboard />} />
             <Route path="/browserCounselors" element={<BrowserCounselors />} />
             <Route path="/checkoutPage" element={<CheckoutPage />} />
             <Route path="/video-call/:sessionId" element={<VideoCall />} />
             <Route path="/chat/:sessionId" element={<ChatPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
export default App;
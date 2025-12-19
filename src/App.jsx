import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import ClientSignUp from './pages/ClientSignUp';
import DashBoard from './pages/DashBoard';

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
             <Route path="/dashboard" element={<DashBoard />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
export default App;
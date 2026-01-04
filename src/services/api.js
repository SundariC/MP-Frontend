import axios from "axios";

const API = axios.create({
  baseURL: "https://mp-backend-1-82km.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --- API Methods ---

// 1. Auth
export const loginAPI = (data) => API.post("/auth/login", data);
export const signupAPI = (data) => API.post("/auth/register", data);

// 2. Counselors
export const fetchCounselors = () => API.get("/auth/counselors");

// 3. Bookings & Payments
export const createOrder = (amount) => API.post("/bookings/create-order", { amount });
export const confirmBooking = (bookingData) => API.post("/bookings/create", bookingData);
export const getMyBookings = () => API.get("/bookings/my-bookings");
export const updateBookingStatus = (data) => API.put("/bookings/update-status", data);

// 4. Messages (Chat)
export const sendMessage = (data) => API.post("/messages", data);
export const getChatHistory = (bookingId) => API.get(`/messages/${bookingId}`);

// 5. Session Notes (Counselor Only)
export const addSessionNote = (data) => API.post("/session/add-note", data);
export const getSessionNotes = (bookingId) => API.get(`/session/${bookingId}`);

export default API;
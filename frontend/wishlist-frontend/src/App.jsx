import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useState } from 'react'
import Login from "./pages/login";
import Signup from "./pages/signup";
import WishlistDetail from"./pages/wishlistproduct.jsx"
import PrivateRoute from "./utils/PrivateRoutes.jsx"
import './App.css'
import Dashboard from "./pages/dashboard.jsx"
function App() {
  useEffect(() => { 
    const handleTabClose = () => {
      sessionStorage.removeItem("token"); // ✅ Remove token on tab close
    };

    window.addEventListener("beforeunload", handleTabClose);
    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/wishlist/:id" element={<WishlistDetail />} />

        </Routes>
    </Router>
  );
}

export default App

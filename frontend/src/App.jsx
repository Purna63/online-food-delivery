import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import ExploreMenu from "./components/ExploreMenu/ExploreMenu";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess";
import Orders from "./pages/Orders/Orders";
import "./App.css";
import RefundPolicy from "./pages/RefundPolicy/RefundPolicy";
import Terms from "./pages/Terms/Terms"; //new added
import Privacy from "./pages/Privacy/Privacy";//new added
import Shipping from "./pages/Shipping/Shipping";//new added
import Contact from "./pages/Contact/Contact";//new added

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1.5s loading
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/menu" element={<ExploreMenu />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms" element={<Terms />} /> //new added
          <Route path="/privacy" element={<Privacy />} />//new added
          <Route path="/shipping" element={<Shipping />} />//new added
          <Route path="/contact" element={<Contact />} />//new added
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;

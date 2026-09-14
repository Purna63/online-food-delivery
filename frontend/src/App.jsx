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
import Terms from "./pages/Terms/Terms";
import Privacy from "./pages/Privacy/Privacy";
import Shipping from "./pages/Shipping/Shipping";
import Contact from "./pages/Contact/Contact";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  // Controls whether LoginPopup opens with Login or Sign Up
  const [loginInitialState, setLoginInitialState] = useState("Login");

  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

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
      {showLogin && (
        <LoginPopup
          setShowLogin={setShowLogin}
          initialState={loginInitialState}
        />
      )}

      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/cart"
            element={
              <Cart
                setShowLogin={setShowLogin}
                setLoginInitialState={setLoginInitialState}
              />
            }
          />

          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/menu" element={<ExploreMenu />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
};

export default App;

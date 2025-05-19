import React, { useContext, useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false); // Toggle for mobile nav
  const searchRef = useRef();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowSearch(false);
      setSearchTerm("");
    }
  };

  return (
    <div className="navbar">
      <Link to={"/"}>
        <img src={assets.logo} alt="Logo" className="logo" />
      </Link>

      {/* Hamburger Icon for Mobile */}
      <div
        className="hamburger-icon"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? "✖" : "☰"}
      </div>

      {/* Menu with conditional class for mobile */}
      <ul className={`navbar-menu ${showMobileMenu ? "show-menu" : ""}`}>
        <span
          onClick={() => {
            setMenu("home");
            navigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
            setShowMobileMenu(false); // Close menu on click
          }}
          className={menu === "home" ? "active" : ""}
          style={{ cursor: "pointer" }}
        >
          Home
        </span>

        <a
          href="#explore-menu"
          onClick={() => {
            setMenu("menu");
            setShowMobileMenu(false);
          }}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>

        <a
          href="#app-download"
          onClick={() => {
            setMenu("mobile-app");
            setShowMobileMenu(false);
          }}
          className={menu === "mobile-app" ? "active" : ""}
        >
          Mobile-App
        </a>

        <a
          href="#footer"
          onClick={() => {
            setMenu("contact-us");
            setShowMobileMenu(false);
          }}
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact Us
        </a>

        <Link
          to="/refund-policy"
          className={menu === "refund-policy" ? "active" : ""}
          onClick={() => {
            setMenu("refund-policy");
            setShowMobileMenu(false);
          }}
        >
          Refund Policy
        </Link>
      </ul>

      <div className="navbar-right">
        {/* Search */}
        <div className="navbar-search-wrapper">
          {!showSearch ? (
            <div
              className="navbar-search-icon"
              onClick={() => setShowSearch(true)}
            >
              <img src={assets.search_icon} alt="Search" />
            </div>
          ) : (
            <form
              ref={searchRef}
              className="navbar-search-box"
              onSubmit={handleSearch}
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">Go</button>
              <span
                className="close-search"
                onClick={() => setShowSearch(false)}
              >
                &times;
              </span>
            </form>
          )}
        </div>

        {/* Cart */}
        <div className="navbar-search-icon">
          <Link to={"/cart"}>
            <img src={assets.basket_icon} alt="Cart" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {/* Auth */}
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign in</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="Profile" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/orders")}>
                <img src={assets.bag_icon} alt="Orders" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="Logout" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

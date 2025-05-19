import React, { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";
import "./StoreStatus.css";

export const StoreStatusContext = createContext();
export const useStoreStatus = () => useContext(StoreStatusContext);
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const StoreStatusProvider = ({ children }) => {
  const [storeConfig, setStoreConfig] = useState({
    openHour: 8,
    closeHour: 21,
    isManuallyClosed: false,
  });

  const [countdown, setCountdown] = useState("");
  const [isOpen, setIsOpen] = useState(true); // always true to NOT restrict frontend

  // Fetch store status from backend
  const fetchStoreStatus = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/store-status`);
      setStoreConfig(res.data);
    } catch (err) {
      console.error("Failed to fetch store status", err);
    }
  };

  // Calculate countdown only for display purposes
  const calculateCountdown = () => {
    const { openHour, closeHour, isManuallyClosed } = storeConfig;
    const now = new Date();
    const openTime = new Date(now);
    const closeTime = new Date(now);

    openTime.setHours(openHour, 0, 0, 0);
    closeTime.setHours(closeHour, 0, 0, 0);

    // We don't use isOpen to block anything, just for UI display
    const currentlyOpen =
      now >= openTime && now < closeTime && !isManuallyClosed;
    setIsOpen(currentlyOpen);

    if (!currentlyOpen) {
      const nextOpen = new Date(now);
      if (now >= closeTime || isManuallyClosed) {
        nextOpen.setDate(nextOpen.getDate() + 1);
      }
      nextOpen.setHours(openHour, 0, 0, 0);

      const diff = nextOpen - now;
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setCountdown(`Reopens in ${hours}h ${minutes}m ${seconds}s`);
    } else {
      setCountdown("");
    }
  };

  useEffect(() => {
    fetchStoreStatus();
  }, []);

  useEffect(() => {
    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [storeConfig]);

  return (
    <StoreStatusContext.Provider
      value={{ isOpen: true, storeConfig, countdown }}
    >
      <div className={`store-status ${isOpen ? "open" : "closed"}`}>
        <p>
          {isOpen ? "🟢 Ready to Take Your Order!" : `🔴 Closed - ${countdown}`}
        </p>
        <span className="hours">
          Hours: {storeConfig.openHour}:00 – {storeConfig.closeHour}:00
        </span>
      </div>
      {children}
    </StoreStatusContext.Provider>
  );
};

export default StoreStatusProvider;

import React, { useEffect, useState } from "react";
import "./OrderSuccess.css";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const [userAddress, setUserAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedAddress = localStorage.getItem("deliveryInfo");

    if (savedAddress) {
      const addressObj = JSON.parse(savedAddress);

      // Construct a well-formatted full address string
      const fullAddress = [
        addressObj.houseNumber,
        addressObj.street,
        addressObj.landmark,
        addressObj.city,
        addressObj.state,
        addressObj.zipcode,
        addressObj.country,
      ]
        .filter(Boolean) // remove empty/undefined values
        .join(", ");

      setUserAddress(fullAddress);
    } else {
      navigate("/");
    }
  }, []);

  const handleTrackClick = () => {
    const storeAddress = "RahamaMarket"; // Destination should be RahamaMarket
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      userAddress
    )}&destination=${encodeURIComponent(storeAddress)}&travelmode=driving`;

    window.open(mapsUrl, "_blank");
  };

  const handleOrdersClick = () => {
    navigate("/orders");
  };

  return (
    <div className="order-success">
      <h2>🎉 Your Order Has Been Placed Successfully!</h2>
      <p>Thank you for ordering with us.</p>

      {userAddress && (
        <div className="track-btn-container">
          <button onClick={handleTrackClick} className="track-order-btn">
            🚚 Track Your Order
          </button>
          <button onClick={handleOrdersClick} className="track-order-btn order-btn">
            📜 Your Orders
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSuccess;
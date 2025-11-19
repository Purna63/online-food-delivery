import React from "react";
import "./Shipping.css";

const Shipping = () => {
  return (
    <div className="policy-container">
      <div className="policy-card">
        <h1 className="policy-title">Shipping / Delivery Policy</h1>
        <p className="policy-text">
          We provide fast and reliable food delivery services within our service
          areas. Our delivery operations ensure customer convenience and timely
          service.
        </p>

        <h2 className="policy-heading">Delivery Time</h2>
        <p className="policy-text">
          Typical delivery time is <strong>30–60 minutes</strong>, depending on
          restaurant load, distance, traffic, and weather conditions.
        </p>

        <h2 className="policy-heading">Order Confirmation</h2>
        <p className="policy-text">
          Once the order is placed, you will receive:
        </p>
        <ul className="policy-list">
          <li>SMS/Email confirmation</li>
          <li>Order status updates</li>
        </ul>

        <h2 className="policy-heading">Delivery Charges</h2>
        <p className="policy-text">
          Delivery charges may apply based on customer location and distance.
        </p>

        <h2 className="policy-heading">Delivery Address</h2>
        <p className="policy-text">
          Customers must provide accurate and complete delivery information.
        </p>

        <h2 className="policy-heading">Delayed Deliveries</h2>
        <p className="policy-text">
          Deliveries may be delayed due to:
        </p>
        <ul className="policy-list">
          <li>Traffic conditions</li>
          <li>Bad weather</li>
          <li>High order volume</li>
          <li>Unreachable customer</li>
        </ul>

        <p className="policy-text">
          In such cases, our team will attempt to contact you regarding the
          status of your order.
        </p>
      </div>
    </div>
  );
};

export default Shipping;

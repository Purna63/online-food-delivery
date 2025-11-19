import React from "react";
import "./Terms.css";

const Terms = () => {
  return (
    <div className="policy-page terms-policy">
      <h1>Terms & Conditions</h1>

      <p className="policy-intro">
        Welcome to our online food delivery service. By accessing or using our
        website, you agree to comply with the following terms and conditions.
      </p>

      <h2>1. Service</h2>
      <p className="policy-text">
        We provide food ordering and delivery services in selected locations.
        Menu availability, pricing, and delivery times may vary.
      </p>

      <h2>2. User Responsibilities</h2>
      <p className="policy-text">
        You must provide accurate information when placing an order. You are
        responsible for safeguarding your account details.
      </p>

      <h2>3. Payments</h2>
      <p className="policy-text">
        Payments can be made through online methods such as Razorpay or
        Cash-on-Delivery (if available). Orders will be processed only after
        successful payment.
      </p>

      <h2>4. Order Acceptance</h2>
      <p className="policy-text">
        Orders may be cancelled or declined if the items are unavailable,
        incorrect, or due to operational reasons.
      </p>

      <h2>5. Delivery</h2>
      <p className="policy-text">
        Delivery times are estimates. Delays may occur due to traffic, weather,
        or operational issues.
      </p>

      <h2>6. Changes to Terms</h2>
      <p className="policy-text">
        We reserve the right to modify these terms at any time without prior
        notice.
      </p>

      <p className="policy-text">
        If you have any questions, contact us at: <br />
        <strong>Phone:</strong> 9777834155 / 7750946466
      </p>
    </div>
  );
};

export default Terms;

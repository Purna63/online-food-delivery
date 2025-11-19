import React from "react";
import "./RefundPolicy.css";

const RefundPolicy = () => {
  return (
    <div className="policy-page">
      <h1>Cancellation & Refund Policy</h1>

      <h2>1. Order Cancellation</h2>
      <p>
        Once an order is placed, it cannot be cancelled by the customer after
        confirmation. You may request cancellation only before the restaurant
        starts preparing your food.
      </p>

      <h2>2. Refund Policy</h2>
      <p>
        Refunds are provided only in the following cases:
      </p>
      <ul>
        <li>Payment was deducted, but the order was not confirmed.</li>
        <li>Restaurant cancelled the order due to unavailability.</li>
        <li>Duplicate payment.</li>
      </ul>

      <h2>3. No Refund Cases</h2>
      <ul>
        <li>Customer is unavailable at the delivery location.</li>
        <li>Incorrect address or phone number entered by the customer.</li>
        <li>Food quality or taste issues (as it is subjective).</li>
      </ul>

      <h2>4. Refund Timeline</h2>
      <p>
        Approved refunds will be processed within 5–7 business days by Razorpay.
      </p>

      <p>
        For refund queries, contact: <br />
        <strong>Phone:</strong> 9777834155 / 7750946466
      </p>
    </div>
  );
};

export default RefundPolicy;

import React from "react";
import "./RefundPolicy.css";

const RefundPolicy = () => {
  return (
    <div className="refund-policy">
      <h1>Refund Policy</h1>
      <p>
        We value your satisfaction and strive to provide you with the best service.
        Please read our refund policy carefully to understand your rights as a customer.
      </p>

      <h2>1. Order Cancellation</h2>
      <p>
        Once an order is confirmed and payment is completed, it cannot be cancelled if the food has already been prepared or dispatched.
      </p>

      <h2>2. Refund Eligibility</h2>
      <ul>
        <li>Refunds are only applicable if there is a proven issue such as wrong items delivered or non-delivery.</li>
        <li>No refunds will be given for dissatisfaction with taste or change of mind after order placement.</li>
      </ul>

      <h2>3. How to Request a Refund</h2>
      <p>
        To request a refund, contact our support team within 24 hours of receiving your order. Include order ID, issue details, and relevant photos (if applicable).
      </p>

      <h2>4. Refund Processing</h2>
      <p>
        If approved, refunds will be processed within 5–7 business days through the original payment method.
      </p>

      <h2>5. Contact Us</h2>
      <p>
        For support or refund inquiries, contact/message: <strong>9777834155.</strong>
      </p>
    </div>
  );
};

export default RefundPolicy;

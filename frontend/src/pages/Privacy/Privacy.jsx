import React from "react";
import "./Privacy.css";

const Privacy = () => {
  return (
    <div className="policy-page privacy-policy">
      <h1>Privacy Policy</h1>

      <p className="policy-intro">
        Your privacy is important to us. This policy describes how we collect,
        use, and protect your personal information.
      </p>

      <h2>1. Information We Collect</h2>
      <ul className="policy-list">
        <li>Name, email, phone number</li>
        <li>Address for delivery</li>
        <li>Payment information (processed securely by Razorpay)</li>
        <li>Order history and preferences</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p className="policy-text">
        We use your information to process orders, deliver food, improve our
        service, and ensure secure payments.
      </p>

      <h2>3. Sharing Information</h2>
      <p className="policy-text">
        We do not sell or share your information with third parties except
        delivery partners and payment providers.
      </p>

      <h2>4. Cookies</h2>
      <p className="policy-text">
        Our website uses cookies to improve user experience and track sessions.
      </p>

      <h2>5. Data Security</h2>
      <p className="policy-text">
        We use industry-standard security measures to protect your data.
      </p>

      <h2>6. Contact</h2>
      <p className="policy-text">
        For privacy-related questions, contact us at: <br />
        <strong>Phone:</strong> 9777834155 / 7750946466
      </p>
    </div>
  );
};

export default Privacy;

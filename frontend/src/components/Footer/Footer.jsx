import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        
        <div className="footer-content-left">
          <img src={assets.logo} alt="" />
          <p>
            We prioritize security to ensure your personal and payment 
            information is always protected. We offer timely deliveries, 
            ensuring your food reaches you fresh and hot. Experience the 
            best taste crafted for your enjoyment.
          </p>
        </div>

        <div className="footer-content-center">
          <h2>IMPORTANT LINKS</h2>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/shipping">Shipping / Delivery Policy</a></li>
            <li><a href="/refund-policy">Cancellation & Refund Policy</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li><strong>Name:&nbsp;</strong> Purna Chandra Pradhan</li>
            <li>
              <strong>Phone:&nbsp;</strong> 9777834155 / 7750946466
            </li>
            <div className="footer-social-icons">
              <a href="https://www.instagram.com/_.purna._/" target="_blank">
                <img src={assets.facebook_icon} alt="" />
              </a>
              <a href="https://x.com/PurnaCh63030947" target="_blank">
                <img src={assets.twitter_icon} alt="" />
              </a>
              <a
                href="https://www.linkedin.com/in/purnachandra63/"
                target="_blank"
              >
                <img src={assets.linkedin_icon} alt="" />
              </a>
            </div>
          </ul>
        </div>
      </div>

      <hr />

      <p className="footer-copyright">
        Copyright 2024 @ Resturant.com - All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;

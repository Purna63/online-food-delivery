import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";


const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="" />
          <p>We prioritize security to ensure your personal and payment information is always protected. We offer timely deliveries, ensuring your food reaches you fresh and hot within the expected window. Experience the best food taste, carefully crafted for your enjoyment.</p>
          
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li><strong>Home-</strong> Rahama</li>
            <li><strong>About us-</strong> Made with ❤️ by Purna Chandra Pradhan — Computer Science B.Tech Student, VSSUT Burla (2020–2024)</li>
            <li><strong>Privacy policy-</strong> Your data is safe with us. We only use it to process and deliver your orders — never shared with others.</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li><strong>Name-&nbsp;&nbsp;</strong> Purna Chandra Pradhan</li>
            <li><strong>Phone-&nbsp;&nbsp;</strong> 9777834155&nbsp;&nbsp;/&nbsp;&nbsp;7750946466</li>
            <div className="footer-social-icons">
            <a
              href="https://www.instagram.com/_.purna._/"
              target="_blank"
            >
            <img src={assets.facebook_icon} alt="" />
            </a>
            <a href="https://x.com/PurnaCh63030947" target="_blank">
              {" "}
              <img src={assets.twitter_icon} alt="" />
            </a>
            <a
              href="https://www.linkedin.com/in/purnachandra63/"
              target="_blank"
            >
              <img src={assets.linkedin_icon} alt="" />
            </a>
            <li>
</li>

          </div>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2024 @ Resturant.com - All Right Reserved.
      </p>
    </div>
  );
};

export default Footer;

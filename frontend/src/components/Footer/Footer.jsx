// import React from "react";
// import "./Footer.css";
// import { assets } from "../../assets/assets";

// const Footer = () => {
//   return (
//     <div className="footer" id="footer">
//       <div className="footer-content">
//         <div className="footer-content-left">
//           <img src={assets.logo} alt="" />
//           <p>This Is simply text. Please Enter Your Valid Data</p>
//           <div className="footer-social-icons">
//             <img src={assets.facebook_icon} alt="" />
//             <a href="https://x.com/PurnaCh63030947" target="_blank">
//               {" "}
//               <img src={assets.twitter_icon} alt="" />
//             </a>
//             <a
//               href="https://www.linkedin.com/in/purnachandra63/"
//               target="_blank"
//             >
//               <img src={assets.linkedin_icon} alt="" />
//             </a>
//           </div>
//         </div>
//         <div className="footer-content-center">
//           <h2>COMPANY</h2>
//           <ul>
//             <li>Home</li>
//             <li>About us</li>
//             <li>Delivery</li>
//             <li>Privacy policy</li>
//           </ul>
//         </div>
//         <div className="footer-content-right">
//           <h2>GET IN TOUCH</h2>
//           <ul>
//             <li>+91-6370767143</li>
//             <li>purnachandrap874@gmail.com</li>
//           </ul>
//         </div>
//       </div>
//       <hr />
//       <p className="footer-copyright">
//         Copyright 2024 @ Resturant.com - All Right Reserved.
//       </p>
//     </div>
//   );
// };

// export default Footer;

// end start new

import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="" />
          <p>This Is simply text. Please Enter Your Valid Data</p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
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
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+91-6370767143</li>
            <li>purnachandrap874@gmail.com</li>
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

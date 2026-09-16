import React from "react";
import "./AppDownload.css";
import { assets } from "../../assets/assets";

const AppDownload = () => {
  return (
    <div className="app-download" id="app-download">
      <p>
        For Better Experience Download <br />
        GoRasoi App
      </p>
<div className="app-download-platfroms">
  <img
    src={assets.play_store}
    alt="Get it on Google Play"
    width="180"
    height="60"
  />

  <img
    src={assets.app_store}
    alt="Download on the App Store"
    width="180"
    height="60"
  />
</div>
    </div>
  );
};

export default AppDownload;

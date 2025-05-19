
import React, { useState, useEffect } from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  const fullText = "Order your favourite food here";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const typingSpeed = 100; // ms per character
    const restartDelay = 3000; // delay before restarting after typing finishes

    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      const resetTimeout = setTimeout(() => {
        setDisplayedText("");
        setIndex(0);
      }, restartDelay);
      return () => clearTimeout(resetTimeout);
    }
  }, [index]);

  return (
    <div className="header">
      <div className="header-contents">
        {/* Animated typing text */}
        <h2>{displayedText}</h2>

        <p>
          Choose from a wide selection of tasty dishes made with the best
          ingredients and expert cooking. We focus on satisfying your hunger
          with expert cooking. Our goal is to make every meal a great
          experience.
        </p>
        <Link to="/menu">
          <button>View Menu</button>
        </Link>
      </div>
    </div>
  );
};

export default Header;

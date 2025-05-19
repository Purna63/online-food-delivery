import React, { useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import "./LoginPopup.css";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    phone: "",
    password: "",
    rePassword: "",
    newPassword: "",
    reNewPassword: "",
  });
  const [showRePassword, setShowRePassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const showMessage = (msg, type = "info") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  const onLogin = async (e) => {
    e.preventDefault();

    if (currState === "Sign Up" && data.password !== data.rePassword) {
      return showMessage("Passwords do not match!", "error");
    }

    const endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";

    try {
      const res = await axios.post(url + endpoint, data);
      if (res.data.success) {
        if (currState === "Login") {
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          showMessage("Login successful!", "success");
        } else {
          showMessage("Account created successfully!", "success");
        }
        setTimeout(() => setShowLogin(false), 2000);
      } else {
        showMessage(res.data.message || "Something went wrong.", "error");
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Server error, try again.";
      showMessage(errMsg, "error");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (data.newPassword !== data.reNewPassword) {
      return showMessage("Passwords do not match!", "error");
    }

    try {
      const res = await axios.post(`${url}/api/user/reset-password`, {
        phone: data.phone,
        newPassword: data.newPassword,
      });

      if (res.data.success) {
        showMessage("Password reset successfully!", "success");
        setCurrState("Login");
      } else {
        showMessage(res.data.message || "Reset failed.", "error");
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Error resetting password.";
      showMessage(errMsg, "error");
    }
  };

  return (
    <div className="login-popup">
      <form
        onSubmit={currState === "Forgot Password" ? handleResetPassword : onLogin}
        className="login-popup-container"
      >
        <div className="login-popup-title">
          <h2>{currState === "Forgot Password" ? "Forgot Password" : currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="close"
          />
        </div>

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}

          <input
            name="phone"
            onChange={onChangeHandler}
            value={data.phone}
            type="tel"
            placeholder="Your phone number"
            pattern="[0-9]{10}"
            required
          />

          {(currState === "Login" || currState === "Sign Up") && (
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type="password"
              placeholder="Password"
              required
            />
          )}

          {currState === "Sign Up" && (
            <div className="password-eye-container">
              <input
                name="rePassword"
                onChange={onChangeHandler}
                value={data.rePassword}
                type={showRePassword ? "text" : "password"}
                placeholder="Re-enter Password"
                required
              />
              <img
                src={showRePassword ? assets.eye_open_icon : assets.eye_close_icon}
                className="eye-icon"
                onClick={() => setShowRePassword(!showRePassword)}
                alt="eye"
              />
            </div>
          )}

          {currState === "Forgot Password" && (
            <>
              <input
                name="newPassword"
                onChange={onChangeHandler}
                value={data.newPassword}
                type="password"
                placeholder="Enter New Password"
                required
              />
              <div className="password-eye-container">
                <input
                  name="reNewPassword"
                  onChange={onChangeHandler}
                  value={data.reNewPassword}
                  type={showRePassword ? "text" : "password"}
                  placeholder="Re-enter New Password"
                  required
                />
                <img
                  src={showRePassword ? assets.eye_open_icon : assets.eye_close_icon}
                  className="eye-icon"
                  onClick={() => setShowRePassword(!showRePassword)}
                  alt="eye"
                />
              </div>
            </>
          )}
        </div>

        {message && (
          <div className={`form-message ${messageType}`}>
            {message}
          </div>
        )}

        <button type="submit">
          {currState === "Sign Up"
            ? "Create Account"
            : currState === "Forgot Password"
            ? "Reset Password"
            : "Login"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

        {currState === "Login" ? (
          <>
            <p>
              Create a new account?{" "}
              <span onClick={() => setCurrState("Sign Up")}>Click here</span>
            </p>
            <p>
              <span onClick={() => setCurrState("Forgot Password")}>Forgot Password?</span>
            </p>
          </>
        ) : currState === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        ) : (
          <p>
            Back to Login?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;

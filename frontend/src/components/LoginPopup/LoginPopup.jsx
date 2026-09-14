import React, { useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import "./LoginPopup.css";

const UserIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="7" r="4" />
    <path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7" />
  </svg>
);

const UserPlusIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="9" cy="8" r="4" />
    <path d="M2.5 21c0-4.2 3-7 6.5-7s6.5 2.8 6.5 7" />
    <path d="M19 8v6" />
    <path d="M16 11h6" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.6 2.5l3 2.7-2 3.2c1.2 2.5 3.2 4.5 5.7 5.7l3.2-2 2.7 3c.5.6.5 1.5-.1 2.1l-1.7 1.7c-.5.5-1.2.7-1.9.5C8.8 17.9 6.1 15.2 4.6 8.5c-.2-.7 0-1.4.5-1.9l1.7-1.7c.6-.6.6-1.5-.2-2.4z" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="5" y="10" width="14" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

const LoginPopup = ({ setShowLogin, initialState = "Login" }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState(initialState);

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

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    if (
      currState === "Sign Up" &&
      data.password !== data.rePassword
    ) {
      return showMessage("Passwords do not match!", "error");
    }

    const endpoint =
      currState === "Login"
        ? "/api/user/login"
        : "/api/user/register";

    try {
      const res = await axios.post(url + endpoint, data);

      if (res.data.success) {
        // Save token after Login OR Sign Up
        if (res.data.token) {
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
        }

        // Remember that this browser has an account
        if (
          currState === "Login" ||
          currState === "Sign Up"
        ) {
          localStorage.setItem("hasAccount", "true");
        }

        if (currState === "Login") {
          showMessage("Login successful!", "success");
        } else {
          showMessage(
            "Account created successfully!",
            "success"
          );
        }

        setTimeout(() => setShowLogin(false), 2000);
      } else {
        showMessage(
          res.data.message || "Something went wrong.",
          "error"
        );
      }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Server error, try again.";

      showMessage(errMsg, "error");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (data.newPassword !== data.reNewPassword) {
      return showMessage(
        "Passwords do not match!",
        "error"
      );
    }

    try {
      const res = await axios.post(
        `${url}/api/user/reset-password`,
        {
          phone: data.phone,
          newPassword: data.newPassword,
        }
      );

      if (res.data.success) {
        showMessage(
          "Password reset successfully!",
          "success"
        );

        setCurrState("Login");
      } else {
        showMessage(
          res.data.message || "Reset failed.",
          "error"
        );
      }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Error resetting password.";

      showMessage(errMsg, "error");
    }
  };

  const isSignUp = currState === "Sign Up";
  const isLogin = currState === "Login";
  const isForgot = currState === "Forgot Password";

  return (
    <div className="login-popup">
      <form
        onSubmit={
          isForgot
            ? handleResetPassword
            : onLogin
        }
        className={`login-popup-container ${
          isSignUp
            ? "signup-container"
            : isForgot
            ? "forgot-container"
            : "login-container"
        }`}
      >
        {/* Close button */}
        <button
          type="button"
          className="login-popup-close"
          onClick={() => setShowLogin(false)}
          aria-label="Close"
        >
          <img src={assets.cross_icon} alt="close" />
        </button>

        {/* Top Icon */}
        <div className="login-popup-icon">
          {isSignUp ? (
            <UserPlusIcon />
          ) : (
            <UserIcon />
          )}
        </div>

        {/* Heading */}
        <div className="login-popup-heading">
          <h2>
            {isSignUp
              ? "Create Account"
              : isForgot
              ? "Forgot Password"
              : "Welcome Back"}
          </h2>

          <p>
            {isSignUp
              ? "Join us for a better food experience."
              : isForgot
              ? "Reset your password to continue."
              : "Login to continue"}
          </p>
        </div>

        {/* Inputs */}
        <div className="login-popup-inputs">

          {/* Name */}
          {isSignUp && (
            <div className="input-wrapper">
              <UserIcon />

              <input
                name="name"
                onChange={onChangeHandler}
                value={data.name}
                type="text"
                placeholder="Your name"
                required
              />
            </div>
          )}

          {/* Phone */}
          <div className="input-wrapper">
            <PhoneIcon />

            <input
              name="phone"
              onChange={onChangeHandler}
              value={data.phone}
              type="tel"
              placeholder="Your phone number"
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />
          </div>

          {/* Login / Signup Password */}
          {(isLogin || isSignUp) && (
            <div className="input-wrapper">
              <LockIcon />

              <input
                name="password"
                onChange={onChangeHandler}
                value={data.password}
                type="password"
                placeholder="Password"
                required
              />

              <img
                src={assets.eye_close_icon}
                className="eye-icon"
                alt="show password"
                onClick={(e) => {
                  const input =
                    e.currentTarget
                      .parentElement
                      .querySelector("input");

                  input.type =
                    input.type === "password"
                      ? "text"
                      : "password";

                  e.currentTarget.src =
                    input.type === "password"
                      ? assets.eye_close_icon
                      : assets.eye_open_icon;
                }}
              />
            </div>
          )}

          {/* Re-enter Password */}
          {isSignUp && (
            <div className="input-wrapper">
              <LockIcon />

              <input
                name="rePassword"
                onChange={onChangeHandler}
                value={data.rePassword}
                type={
                  showRePassword
                    ? "text"
                    : "password"
                }
                placeholder="Re-enter Password"
                required
              />

              <img
                src={
                  showRePassword
                    ? assets.eye_open_icon
                    : assets.eye_close_icon
                }
                className="eye-icon"
                onClick={() =>
                  setShowRePassword(
                    !showRePassword
                  )
                }
                alt="show password"
              />
            </div>
          )}

          {/* Forgot Password */}
          {isForgot && (
            <>
              <div className="input-wrapper">
                <LockIcon />

                <input
                  name="newPassword"
                  onChange={onChangeHandler}
                  value={data.newPassword}
                  type="password"
                  placeholder="Enter New Password"
                  required
                />
              </div>

              <div className="input-wrapper">
                <LockIcon />

                <input
                  name="reNewPassword"
                  onChange={onChangeHandler}
                  value={data.reNewPassword}
                  type={
                    showRePassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Re-enter New Password"
                  required
                />

                <img
                  src={
                    showRePassword
                      ? assets.eye_open_icon
                      : assets.eye_close_icon
                  }
                  className="eye-icon"
                  onClick={() =>
                    setShowRePassword(
                      !showRePassword
                    )
                  }
                  alt="show password"
                />
              </div>
            </>
          )}
        </div>

        {/* Message */}
        {message && (
          <div
            className={`form-message ${messageType}`}
          >
            {message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="login-submit-button"
        >
          {isSignUp
            ? "Create Account"
            : isForgot
            ? "Reset Password"
            : "Login"}
        </button>

        {/* Terms */}
        <div className="login-popup-condition">
          <input
            type="checkbox"
            required
          />

          <p>
            By continuing, I agree to the terms of use &
            privacy policy.
          </p>
        </div>

        {/* Bottom Links */}
        {isLogin ? (
          <div className="login-bottom-links">
            <p
              className="forgot-link"
              onClick={() =>
                setCurrState("Forgot Password")
              }
            >
              Forgot Password?
            </p>

            <p>
              Create a new account?{" "}
              <span
                onClick={() =>
                  setCurrState("Sign Up")
                }
              >
                Click here
              </span>
            </p>
          </div>
        ) : isSignUp ? (
          <p className="account-switch-text">
            Already have an account?{" "}
            <span
              onClick={() =>
                setCurrState("Login")
              }
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="account-switch-text">
            Back to Login?{" "}
            <span
              onClick={() =>
                setCurrState("Login")
              }
            >
              Login here
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;

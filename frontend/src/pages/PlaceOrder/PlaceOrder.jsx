import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PlaceOrder = () => {
  const { getTotalCartAmount, token, cartItems, food_list } =
    useContext(StoreContext);
  const navigate = useNavigate();
  const Deliverycharge = 10;

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
    landmark: "",
  });

  const [errors, setErrors] = useState({ email: "", phone: "" });
  const [errorVisible, setErrorVisible] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [countdown, setCountdown] = useState("");
  const [storeClosedMessage, setStoreClosedMessage] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    let newErrors = { email: "", phone: "" };

    if (!emailRegex.test(data.email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    }

    if (!phoneRegex.test(data.phone)) {
      newErrors.phone = "Phone must be 10 digits";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) {
      setErrorVisible(true);
      setTimeout(() => setErrorVisible(false), 4000);
    }

    return valid;
  };

  const fetchStoreStatus = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/store-status`);
      const { openHour, closeHour, isManuallyClosed } = res.data;

      const now = new Date();
      const currentHour = now.getHours();

      const isOpenNow =
        currentHour >= openHour && currentHour < closeHour && !isManuallyClosed;

      setIsStoreOpen(isOpenNow);

      if (!isOpenNow) {
        const nextOpen = new Date(now);
        if (currentHour >= closeHour || isManuallyClosed)
          nextOpen.setDate(nextOpen.getDate() + 1);
        nextOpen.setHours(openHour, 0, 0, 0);

        const diff = nextOpen - now;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        setCountdown(`Store closed. Reopens in ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setCountdown("");
      }
    } catch (err) {
      console.error("Error fetching store status:", err);
    }
  };

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/Orders");
    }
  }, [token]);

  useEffect(() => {
    fetchStoreStatus();
    const interval = setInterval(fetchStoreStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const placeOrder = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // if (!isStoreOpen) {
    //   alert("Store is currently closed. Please try again later.");
    //   return;
    // }
    if(!isStoreOpen){
      setStoreClosedMessage(true);
      setTimeout(()=>setStoreClosedMessage(false),5000);
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentOption = async (option) => {
    await fetchStoreStatus();

    if (!isStoreOpen) {
      alert("Payment failed. Store is now closed.");
      setShowPaymentModal(false);
      return;
    }

    const totalAmount = getTotalCartAmount() + Deliverycharge;
    const orderData = {
      cartItems,
      food_list,
      deliveryInfo: data,
      amount: totalAmount,
      payment: true, // online payment only
    };

    const saveDeliveryInfo = () => {
      localStorage.setItem("deliveryInfo", JSON.stringify(data));
    };

    if (option === "Online Payment") {
      try {
        setIsLoadingPayment(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        script.onload = async () => {
          const response = await fetch(
            `${BACKEND_URL}/api/payment/create-order`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount: totalAmount * 100 }),
            }
          );
          const order = await response.json();

          const options = {
            key: "rzp_test_faG3OjjiMCoD2S",
            amount: order.amount,
            currency: "INR",
            name: "Food Delivery",
            order_id: order.id,
            handler: async function () {
              await fetch(`${BACKEND_URL}/api/order`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
              });
              saveDeliveryInfo();
              navigate("/order-success");
            },
            prefill: {
              name: `${data.firstName} ${data.lastName}`,
              email: data.email,
              contact: data.phone,
            },
            theme: { color: "#F37254" },
          };

          setIsLoadingPayment(false);
          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
        };
      } catch (err) {
        console.error("Payment error", err);
        setIsLoadingPayment(false);
      }
    }
  };

  return (
    <div className="plac">
      {errorVisible && (
        <div className="error-message-top">
          <p>{errors.phone || errors.email}</p>
        </div>
      )}

       {storeClosedMessage && (
        <div className="store-closed-message">
          <p>The store is currently closed. Please come back tomorrow.</p>
        </div>
      )}

      <form onSubmit={placeOrder} className="place-order">
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input
              required
              name="firstName"
              onChange={onChangeHandler}
              value={data.firstName}
              type="text"
              placeholder="First name"
            />
            <input
              required
              name="lastName"
              onChange={onChangeHandler}
              value={data.lastName}
              type="text"
              placeholder="Last name"
            />
          </div>
          <input
            required
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Email address"
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
          <div className="multi-fields">
            <input
              required
              name="street"
              onChange={onChangeHandler}
              value={data.street}
              type="text"
              placeholder="Street / Village"
            />
            <input
              required
              name="landmark"
              onChange={onChangeHandler}
              value={data.landmark}
              type="text"
              placeholder="Landmark"
            />
          </div>
          <div className="multi-fields">
            <input
              required
              name="city"
              onChange={onChangeHandler}
              value={data.city}
              type="text"
              placeholder="City"
            />
            <input
              required
              name="state"
              onChange={onChangeHandler}
              value={data.state}
              type="text"
              placeholder="State"
            />
          </div>
          <div className="multi-fields">
            <input
              required
              name="zipcode"
              onChange={onChangeHandler}
              value={data.zipcode}
              type="text"
              placeholder="Zip Code"
            />
            <input
              required
              name="country"
              onChange={onChangeHandler}
              value={data.country}
              type="text"
              placeholder="Country"
            />
          </div>
          <input
            required
            name="phone"
            onChange={onChangeHandler}
            value={data.phone}
            type="text"
            placeholder="Mobile No."
          />
          {errors.phone && <p className="error-message">{errors.phone}</p>}
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : Deliverycharge}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ₹
                {getTotalCartAmount() +
                  (getTotalCartAmount() === 0 ? 0 : Deliverycharge)}
              </b>
            </div>
            <button type="submit">Proceed To Payment</button>
          </div>
        </div>
      </form>

      {showPaymentModal && (
        <div className="payment-modal">
          <div className="payment-modal-content">
            <h3>Only Online Payment Available</h3>
            <button onClick={() => handlePaymentOption("Online Payment")}>
              Online Payment
            </button>
            <button className="close-btn" onClick={() => setShowPaymentModal(false)}>Cancel</button>
          </div>
        </div>
      )}
      {isLoadingPayment &&(
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;

import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LocationPicker from "../../components/LocationPicker/LocationPicker"; //new
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

const PlaceOrder = () => {
  const { getTotalCartAmount, token, cartItems, food_list } =
    useContext(StoreContext);
  const navigate = useNavigate();
  // const Deliverycharge = 10;

  const [data, setData] = useState({
    firstName: "",
    // email: "",
    street: "",
    city: "",
    state: "Odisha",
    // zipcode: "",
    country: "India",
    phone: "",
    landmark: "",
    // NEW FIELD
    lat: "",
    lng: "",
  });

  const [errors, setErrors] = useState({ phone: "" });
  const [errorVisible, setErrorVisible] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [countdown, setCountdown] = useState("");
  const [storeClosedMessage, setStoreClosedMessage] = useState(false);

  //new line add
  const [locationMessage, setLocationMessage] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [distance, setDistance] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [isLocationLocked, setIsLocationLocked] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(true); //new add
  const [hasSavedAddress, setHasSavedAddress] = useState(false); //new add

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // GET USER CURRENT LOCATION
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        console.log("User location:", lat, lng);

        // setData((prev) => ({
        //   ...prev,
        //   lat,
        //   lng,
        // }));

        setData((prev) => ({
          ...prev,
          lat: lat,
          lng: lng,
        }));

        try {
          const res = await axios.post(`${BACKEND_URL}/api/distance`, {
            lat,
            lng,
          });

          if (res.data.error) {
            setLocationMessage(res.data.error);

            setTimeout(() => {
              setLocationMessage("");
            }, 5000);

            return;
          }

          console.log("Distance API:", res.data);

          setDistance(res.data.distance);
          setDeliveryFee(res.data.deliveryCharge);

          // Auto fill address
          if (res.data.address) {
            setData((prev) => ({
              ...prev,
              lat: lat,
              lng: lng,
              street: res.data.address,
            }));

            setIsLocationLocked(true);

            // save location
            localStorage.setItem("deliveryAddress", res.data.address);
            localStorage.setItem("deliveryLat", lat);
            localStorage.setItem("deliveryLng", lng);
          }
        } catch (err) {
          console.error("Distance API error:", err);
          alert("Failed to calculate delivery distance.");
        }
      },

      (error) => {
        console.error("Location error:", error);

        setLocationMessage(
          "⚠️ We could not detect your location. Please click 'Select Location On Map' and tap your house.",
        );

        setShowMap(true);

        setTimeout(() => {
          setLocationMessage("");
        }, 5000);
      },
    );
  };

  const setLocation = async (lat, lng) => {
    setData((prev) => ({
      ...prev,
      lat,
      lng,
    }));

    try {
      const res = await axios.post(`${BACKEND_URL}/api/distance`, {
        lat,
        lng,
      });

      console.log("Distance API response:", res.data);

      if (res.data.error) {
        setLocationMessage(res.data.error);
        return;
      }

      setDistance(res.data.distance);
      setDeliveryFee(res.data.deliveryCharge);

      // 🔹 Auto Fill Address
      if (res.data.address) {
        // setData((prev) => ({
        //   ...prev,
        //   street: res.data.address,
        // }));

        setData((prev) => ({
          ...prev,
          street: res.data.address,
        }));

        // lock address editing
        setIsLocationLocked(true);

        // save location
        localStorage.setItem("deliveryAddress", res.data.address);
        localStorage.setItem("deliveryLat", lat);
        localStorage.setItem("deliveryLng", lng);
      }
    } catch (err) {
      console.error("Distance API error:", err);
    }
  };

  // RESET ADDRESS & MAP
  const resetLocation = () => {
    // clear localStorage
    localStorage.removeItem("deliveryAddress");
    localStorage.removeItem("deliveryLat");
    localStorage.removeItem("deliveryLng");

    // reset states
    setData((prev) => ({
      ...prev,
      street: "",
      lat: "",
      lng: "",
    }));

    setDistance(null);
    setDeliveryFee(0);
    setIsLocationLocked(false);
    setShowMap(false);

    setLocationMessage("Location reset. Please select your location again.");

    setTimeout(() => {
      setLocationMessage("");
    }, 4000);
  };

  const validate = () => {
    let valid = true;
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    let newErrors = {  phone: "" };

    // if (showAddressForm && !emailRegex.test(data.email)) {
    //   newErrors.email = "Invalid email address";
    //   valid = false;
    // }

//     if (showAddressForm && data.email && !emailRegex.test(data.email)) {
//   newErrors.email = "Invalid email address";
//   valid = false;
// }

    if (showAddressForm && !phoneRegex.test(data.phone)) {
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
        if (currentHour >= closeHour || isManuallyClosed) {
          nextOpen.setDate(nextOpen.getDate() + 1);
        }

        nextOpen.setHours(openHour, 0, 0, 0);

        const diff = nextOpen - now;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        setCountdown(
          `Store closed. Reopens in ${hours}h ${minutes}m ${seconds}s`,
        );
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

  // add new line
  useEffect(() => {
    const savedAddress = localStorage.getItem("deliveryAddress");
    const savedLat = localStorage.getItem("deliveryLat");
    const savedLng = localStorage.getItem("deliveryLng");

    if (savedAddress && savedLat && savedLng) {
      setData((prev) => ({
        ...prev,
        street: savedAddress,
        lat: savedLat,
        lng: savedLng,
      }));

      setIsLocationLocked(true);
    }
  }, []);

  useEffect(() => {
    const loadAddress = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/user/get-address`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (
          res.data.success &&
          res.data.street &&
          res.data.landmark &&
          res.data.lat &&
          res.data.lng
        ) {
          setHasSavedAddress(true);

          setData((prev) => ({
            ...prev,
            street: res.data.street,
            landmark: res.data.landmark,
            lat: res.data.lat,
            lng: res.data.lng,
            firstName: res.data.name || "",
            phone: res.data.phone || "",
          }));

          // calculate delivery fee again
          const distanceRes = await axios.post(`${BACKEND_URL}/api/distance`, {
            lat: res.data.lat,
            lng: res.data.lng,
          });

          setDistance(distanceRes.data.distance);
          setDeliveryFee(distanceRes.data.deliveryCharge);

          setShowAddressForm(false);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (token) loadAddress();
  }, [token]);

  const placeOrder = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // USER DID NOT SELECT LOCATION
    if (!distance) {
      setLocationMessage(
        "⚠️ Please select your delivery location first using 'Use My Current Location' or 'Select Location On Map'.",
      );

      // hide message after 5 seconds
      setTimeout(() => {
        setLocationMessage("");
      }, 5000);

      return;
    }

    if (!isStoreOpen) {
      setStoreClosedMessage(true);
      setTimeout(() => setStoreClosedMessage(false), 5000);
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentOption = async () => {
    if (!distance) {
      setLocationMessage(
        "⚠️ Please select your delivery location first using 'Use My Current Location' or 'Select Location On Map'.",
      );

      setTimeout(() => {
        setLocationMessage("");
      }, 5000);

      return;
    }

    await fetchStoreStatus();

    if (!isStoreOpen) {
      alert("Payment failed. Store is now closed.");
      setShowPaymentModal(false);
      return;
    }

    // const totalAmount = getTotalCartAmount() + Deliverycharge;
    const totalAmount = getTotalCartAmount() + deliveryFee;

    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: cartItems[item._id],

        // IMPORTANT
        shopName: item.shopName,
      }));

    const saveDeliveryInfo = () => {
      localStorage.setItem("deliveryInfo", JSON.stringify(data));
    };

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
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: totalAmount * 100 }),
          },
        );

        const order = await response.json();
        const orderData = {
          items: orderItems,
          deliveryInfo: data,
          payment: false,
          deliveryFee: deliveryFee,
          amount: totalAmount,
          status: "Payment Pending",
          razorpayOrderId: order.id,
        };
        const saveOrderResponse = await fetch(`${BACKEND_URL}/api/order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        });

const savedOrder = await saveOrderResponse.json();

if (!savedOrder.success) {
  alert("Failed to create order");
  return;
}

// Save MongoDB Order ID
const orderId = savedOrder.order._id;
        const options = {
          key: RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: "INR",
          name: "Food Delivery",
          description: "Order Payment",
          order_id: order.id,
          handler: async function (response) {
            try {
              saveDeliveryInfo();

              await axios.post(
  `${BACKEND_URL}/api/user/save-address`,
  {
    street: data.street,
    landmark: data.landmark,
    lat: data.lat,
    lng: data.lng,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
);

// UPDATE PAYMENT STATUS
await axios.patch(
  `${BACKEND_URL}/api/order/payment-success/${orderId}`
);

navigate("/order-success");
            } catch (error) {
              console.log("Order Save Error:", error);

              alert(
                "Payment completed. If order not shown, contact support with payment screenshot.",
              );
            }
          },

          prefill: {
            name: `${data.firstName}`,
            // email: data.email,
            contact: data.phone,
          },

          notes: {
            address: data.street,
          },

          theme: {
            color: "#F37254",
          },

          config: {
            display: {
              blocks: {
                upi: {
                  name: "Pay using UPI",
                  instruments: [
                    {
                      method: "upi",
                    },
                  ],
                },
              },

              sequence: ["block.upi"],

              preferences: {
                show_default_blocks: true,
              },
            },
          },

          modal: {
            ondismiss: function () {
              console.log("Payment popup closed");
            },
          },
        };

        setIsLoadingPayment(false);

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      };
    } catch (err) {
      console.error("Payment error", err);
      setIsLoadingPayment(false);
    }
  };

 return (
  <div className="plac">
    {/* TOP PHONE ERROR */}
    {errorVisible && (
      <div className="error-message-top">
        <p>{errors.phone}</p>
      </div>
    )}

    {/* LOCATION MESSAGE */}
    {locationMessage && (
      <div className="location-popup-overlay">
        <div className="location-popup-box">
          <p>{locationMessage}</p>

          <button
            type="button"
            onClick={() => setLocationMessage("")}
            className="location-popup-btn"
          >
            OK
          </button>
        </div>
      </div>
    )}

    {/* STORE CLOSED */}
    {storeClosedMessage && (
      <div className="store-closed-message">
        <p>
          The store is currently closed. Please come back tomorrow.
        </p>
      </div>
    )}

    <form onSubmit={placeOrder} className="place-order">

      {/* ================= LEFT SIDE ================= */}
      <div className="place-order-left">

        {/* PAGE TITLE */}
        <div className="page-heading">
          <h1>Delivery Information</h1>
          <p>Tell us where to deliver your delicious food</p>
        </div>

        {/* CONTACT & DELIVERY DETAILS */}
        <div className="delivery-card">

          <div className="card-heading">
            <div className="card-icon">
              👤
            </div>

            <div>
              <h2>Contact &amp; delivery details</h2>
              <p>Please fill in your delivery information</p>
            </div>
          </div>

          {!showAddressForm ? (
            /* ================= SAVED ADDRESS ================= */
            <div className="saved-address-new">

              <div className="saved-address-row">
                <span className="saved-label">Full Name</span>
                <strong>{data.firstName || "Customer"}</strong>
              </div>

              <div className="saved-address-row">
                <span className="saved-label">Full Address</span>
                <span>{data.street}</span>
              </div>

              <div className="saved-address-row">
                <span className="saved-label">Landmark</span>
                <span>{data.landmark}</span>
              </div>

              <div className="saved-address-grid">
                <div className="saved-address-row">
                  <span className="saved-label">Phone Number</span>
                  <span>{data.phone}</span>
                </div>

                <div className="saved-address-row">
                  <span className="saved-label">State</span>
                  <span>Odisha</span>
                </div>
              </div>

              <button
                className="change-address-btn"
                type="button"
                onClick={() => setShowAddressForm(true)}
              >
                ✏️ Change
              </button>
            </div>
          ) : (
            <>
              {/* FULL NAME */}
              <div className="form-field full-width">
                <label>Full Name</label>

                <input
                  required
                  name="firstName"
                  onChange={onChangeHandler}
                  value={data.firstName}
                  type="text"
                  placeholder="Enter your name"
                />
              </div>

              {/* FULL ADDRESS */}
              <div className="form-field full-width">
                <label>Full Address</label>

                <input
                  required
                  name="street"
                  value={data.street}
                  onChange={onChangeHandler}
                  type="text"
                  placeholder="Street / Village"
                  readOnly={isLocationLocked}
                />
              </div>

              {/* LANDMARK */}
              <div className="form-field full-width">
                <label>
                  Landmark <span>(Optional)</span>
                </label>

                <input
                  name="landmark"
                  onChange={onChangeHandler}
                  value={data.landmark}
                  type="text"
                  placeholder="Nearby landmark"
                />
              </div>

              {/* CITY + STATE */}
              <div className="form-row">

                <div className="form-field">
                  <label>City</label>

                  <input
                    required
                    name="city"
                    onChange={onChangeHandler}
                    value={data.city}
                    type="text"
                    placeholder="City"
                  />
                </div>

                <div className="form-field">
                  <label>State</label>

                  <input
                    name="state"
                    value="Odisha"
                    readOnly
                  />
                </div>

              </div>

              {/* COUNTRY + PHONE */}
              <div className="form-row">

                <div className="form-field">
                  <label>Country</label>

                  <input
                    name="country"
                    value="India"
                    readOnly
                  />
                </div>

                <div className="form-field">
                  <label>Phone Number</label>

                  <input
                    required
                    name="phone"
                    onChange={onChangeHandler}
                    value={data.phone}
                    type="text"
                    inputMode="numeric"
                    placeholder="10-digit mobile number"
                  />
                </div>

              </div>

              {errors.phone && (
                <p className="error-message">{errors.phone}</p>
              )}
            </>
          )}
        </div>


        {/* ================= DELIVERY LOCATION ================= */}
        <div className="delivery-card location-card">

          <div className="card-heading">
            <div className="card-icon location-icon">
              📍
            </div>

            <div>
              <h2>Delivery location</h2>
              <p>
                Select your delivery location using one of the options below.
              </p>
            </div>
          </div>

          {/* LOCATION BUTTONS */}
          <div className="location-buttons-new">

            <button
              type="button"
              className="current-location-btn"
              onClick={getLocation}
            >
              <span className="location-button-icon">◎</span>
              <span>Use My Current Location</span>
            </button>

            <button
              type="button"
              className="map-location-btn"
              onClick={() => setShowMap(true)}
            >
              <span className="location-button-icon">▱</span>
              <span>Select Location on Map</span>
            </button>

          </div>

          {/* SELECTED LOCATION */}
          {distance && data.street && (
            <div className="selected-location">

              <div className="selected-location-icon">
                📍
              </div>

              <div className="selected-location-text">
                <span>Selected location:</span>
                <p>{data.street}</p>
              </div>

              <button
                type="button"
                className="selected-location-change"
                onClick={resetLocation}
              >
                ✏️ Change
              </button>

            </div>
          )}

          {/* MAP */}
          {showMap && (
            <div className="location-picker-wrapper">
              <LocationPicker setLocation={setLocation} />
            </div>
          )}

          {/* DISTANCE */}
          {distance && (
            <div className="location-distance">
              <span>📏 Delivery distance</span>
              <strong>{distance} km</strong>
            </div>
          )}

        </div>

      </div>


      {/* ================= RIGHT SIDE ================= */}
      <div className="place-order-right">

        <div className="cart-total order-summary-card">

          <div className="card-heading summary-heading">
            <div className="card-icon summary-icon">
              🧾
            </div>

            <div>
              <h2>Order Summary</h2>
              <p>Here's a quick summary of your order</p>
            </div>
          </div>

          <div className="summary-details">

            <div className="summary-row">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>

            <div className="summary-row">
              <p>
                Delivery Fee + Distance Fee
                <span className="info-icon">ⓘ</span>
              </p>

              <p>₹{deliveryFee}</p>
            </div>

          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <b>Total</b>
            <b>₹{getTotalCartAmount() + deliveryFee}</b>
          </div>

        </div>

      </div>


      {/* ================= MOBILE PAYMENT BUTTON ================= */}
      <div className="mobile-payment-bar">
        <button type="submit" className="mobile-payment-btn">
          <span>Proceed To Payment</span>
          <span className="payment-arrow">→</span>
        </button>
      </div>

      {/* DESKTOP PAYMENT BUTTON */}
      <button type="submit" className="desktop-payment-btn">
        Proceed To Payment
      </button>

    </form>


    {/* ================= PAYMENT MODAL ================= */}
    {showPaymentModal && (
      <div className="payment-modal">

        <div className="payment-modal-content">

          <h3>Only Online Payment Available</h3>

          <button
            type="button"
            onClick={() => handlePaymentOption("Online Payment")}
          >
            Online Payment
          </button>

          <button
            type="button"
            className="close-btn"
            onClick={() => setShowPaymentModal(false)}
          >
            Cancel
          </button>

        </div>

      </div>
    )}


    {/* ================= PAYMENT LOADING ================= */}
    {isLoadingPayment && (
      <div className="spinner-overlay">
        <div className="spinner"></div>
      </div>
    )}

  </div>
);
};

export default PlaceOrder;

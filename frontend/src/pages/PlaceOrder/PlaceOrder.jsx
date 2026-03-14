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
    email: "",
    street: "",
    city: "",
    state: "Odisha",
    zipcode: "",
    country: "India",
    phone: "",
    landmark: "",
    // NEW FIELD
    lat: "",
    lng: "",
  });

  const [errors, setErrors] = useState({ email: "", phone: "" });
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
  const [showAddressForm, setShowAddressForm] = useState(true);//new add
  const [hasSavedAddress, setHasSavedAddress] = useState(false);//new add

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    let newErrors = { email: "", phone: "" };

    if (showAddressForm && !emailRegex.test(data.email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    }

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


    
    if(!isStoreOpen){
      setStoreClosedMessage(true);
      setTimeout(()=>setStoreClosedMessage(false),5000);
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

    const orderData = {
      cartItems,
      food_list,
      deliveryInfo: data,
      payment: true,
    };

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

        const options = {
          key: RAZORPAY_KEY_ID,
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
            await axios.post(
              `${BACKEND_URL}/api/user/save-address`,
              {
                street: data.street,
                landmark: data.landmark,
                //new add second
                lat: data.lat,
                lng: data.lng,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            navigate("/order-success");
          },
          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: data.phone,
          },
          theme: {
            color: "#F37254",
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
      {errorVisible && (
        <div className="error-message-top">
          <p>{errors.phone || errors.email}</p>
        </div>
      )}

      {/* Add new line */}
      {locationMessage && (
        <div className="error-message-top">
          <p>{locationMessage}</p>
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

          {!showAddressForm ? (
            <div className="saved-address-box">
              <p>
                <strong>{data.firstName || "Customer"}</strong>
              </p>
              <p>{data.street}</p>
              <p>{data.landmark}</p>
              <p>{data.phone}</p>

              <button
                className="change-address-btn"
                type="button"
                onClick={() => setShowAddressForm(true)}
              >
                Change
              </button>
            </div>
          ) : (
            <>
              <div className="multi-fields">
                <input
                  required
                  name="firstName"
                  onChange={onChangeHandler}
                  value={data.firstName}
                  type="text"
                  placeholder="Enter Your name"
                />
              </div>

              <input
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
                  value={data.street}
                  onChange={onChangeHandler}
                  type="text"
                  placeholder="Street / Village"
                  readOnly={isLocationLocked}
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
                  name="zipcode"
                  onChange={onChangeHandler}
                  value={data.zipcode}
                  type="text"
                  placeholder="Pin Code"
                />
              </div>

              <div className="multi-fields">
                <input name="state" value="Odisha" readOnly />
                <input name="country" value="India" readOnly />
              </div>

              <input
                required
                name="phone"
                onChange={onChangeHandler}
                value={data.phone}
                type="text"
                placeholder="Mobile No."
              />

              <p style={{ fontSize: "14px", color: "#555", marginTop: "10px" }}>
                📍 Please select your delivery location using one of the buttons
                below.
              </p>

              <button
                type="button"
                className="location-btn"
                onClick={resetLocation}
              >
                Reset Address
              </button>

              <br />

              <div className="location-buttons">
                <button
                  className="location-btn"
                  type="button"
                  onClick={getLocation}
                >
                  Use My Current Location
                </button>

                <button
                  type="button"
                  className="location-btn"
                  onClick={() => setShowMap(true)}
                >
                  Select Location On Map
                </button>
              </div>

              {showMap && <LocationPicker setLocation={setLocation} />}

              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </>
          )}
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />

            {distance && (
              <div className="cart-total-details">
                <p>Distance</p>
                <p>{distance} km</p>
              </div>
            )}

            <hr />
            
            
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ₹
                {getTotalCartAmount() + deliveryFee }
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

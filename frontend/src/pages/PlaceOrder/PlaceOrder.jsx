// // import React, { useContext, useState } from "react";
// // import "./PlaceOrder.css";
// // import { StoreContext } from "../../context/StoreContext";
// // import axios from "axios";

// // const PlaceOrder = () => {
// //   const { getTotalCartAmount, token, food_list, cartItems, url } =
// //     useContext(StoreContext);

// //   const [data, setData] = useState({
// //     firstName: "",
// //     lastName: "",
// //     email: "",
// //     street: "",
// //     city: "",
// //     state: "",
// //     zipcode: "",
// //     country: "",
// //     phone: "",
// //   });

// //   const onChangeHandler = (event) => {
// //     const name = event.target.name;
// //     const value = event.target.value;
// //     setData((data) => ({ ...data, [name]: value }));
// //   };

// //   const placeOrder = async (event) => {
// //     event.preventDefault();
// //     let orderItems = [];
// //     food_list.map((item) => {
// //       if (cartItems[item._id] > 0) {
// //         let itemInfo = item;
// //         itemInfo["quantity"] = cartItems[item._id];
// //         orderItems.push(itemInfo);
// //       }
// //     });
// //     let orderData = {
// //       address: data,
// //       items: orderItems,
// //       amount: getTotalCartAmount() + 2, // this 2 is delivery charge
// //     };
// //     let response = await axios.post(url + "/api/order/place", orderData, {
// //       headers: { token },
// //     });
// //     if (response.data.success) {
// //       const { session_url } = response.data;
// //       window.location.replace(session_url);
// //     } else {
// //       alert("Error");
// //     }
// //   };

// //   return (
// //     <form onSubmit={placeOrder} className="place-order">
// //       <div className="place-order-left">
// //         <p className="title">Delivery Information</p>
// //         <div className="multi-fields">
// //           <input
// //             required
// //             name="firstName"
// //             onChange={onChangeHandler}
// //             value={data.firstName}
// //             type="text"
// //             placeholder="First name"
// //           />
// //           <input
// //             required
// //             name="lastName"
// //             onChange={onChangeHandler}
// //             value={data.lastName}
// //             type="text"
// //             placeholder="Last name"
// //           />
// //         </div>
// //         <input
// //           required
// //           name="email"
// //           onChange={onChangeHandler}
// //           value={data.email}
// //           type="email"
// //           placeholder="Email address"
// //         />
// //         <input
// //           required
// //           name="street"
// //           onChange={onChangeHandler}
// //           value={data.street}
// //           type="text"
// //           placeholder="Street"
// //         />
// //         <div className="multi-fields">
// //           <input
// //             required
// //             name="city"
// //             onChange={onChangeHandler}
// //             value={data.city}
// //             type="text"
// //             placeholder="City"
// //           />
// //           <input
// //             required
// //             name="state"
// //             onChange={onChangeHandler}
// //             value={data.state}
// //             type="text"
// //             placeholder="State"
// //           />
// //         </div>
// //         <div className="multi-fields">
// //           <input
// //             required
// //             name="zipcode"
// //             onChange={onChangeHandler}
// //             value={data.zipcode}
// //             type="text"
// //             placeholder="Zip Code"
// //           />
// //           <input
// //             required
// //             name="country"
// //             onChange={onChangeHandler}
// //             value={data.country}
// //             type="text"
// //             placeholder="Country"
// //           />
// //         </div>
// //         <input
// //           required
// //           name="phone"
// //           onChange={onChangeHandler}
// //           value={data.phone}
// //           type="text"
// //           placeholder="Mobile No."
// //         />
// //       </div>
// //       <div className="place-order-right">
// //         <div className="cart-total">
// //           <h2>Cart Totals</h2>
// //           <div>
// //             <div className="cart-total-details">
// //               <p>Subtotal</p>
// //               <p>${getTotalCartAmount()}</p>
// //             </div>
// //             <hr />
// //             <div className="cart-total-details">
// //               <p>Delivery Fee</p>
// //               <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
// //             </div>
// //             <hr />
// //             <div className="cart-total-details">
// //               <b>Total</b>
// //               <b>
// //                 ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
// //               </b>
// //             </div>
// //           </div>
// //           <button type="submit">PROCEED TO PAYMENT</button>
// //         </div>
// //       </div>
// //     </form>
// //   );
// // };

// // export default PlaceOrder;

// import React, { useContext, useEffect, useState } from "react";
// import "./PlaceOrder.css";
// import { StoreContext } from "../../context/StoreContext";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";

// const PlaceOrder = () => {
//   const { getTotalCartAmount, token, food_list, cartItems, url } =
//     useContext(StoreContext);

//   const [data, setData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     street: "",
//     city: "",
//     state: "",
//     zipcode: "",
//     country: "",
//     phone: "",
//   });

//   const onChangeHandler = (event) => {
//     const name = event.target.name;
//     const value = event.target.value;
//     setData((data) => ({ ...data, [name]: value }));
//   };

//   // const placeOrder = async (event) => {
//   //   event.preventDefault();

//   //   // Prepare the order items
//   //   let orderItems = [];
//   //   food_list.map((item) => {
//   //     if (cartItems[item._id] > 0) {
//   //       let itemInfo = item;
//   //       itemInfo["quantity"] = cartItems[item._id];
//   //       orderItems.push(itemInfo);
//   //     }
//   //   });

//   //   // Ensure the cart is not empty before proceeding
//   //   if (orderItems.length === 0) {
//   //     alert("Your cart is empty!");
//   //     return;
//   //   }

//   //   // Prepare the order data
//     // let orderData = {
//     //   address: data,
//     //   items: orderItems,
//     //   amount: getTotalCartAmount() + 2, // Adding delivery charge
//     // };

//     //   let response = await axios.post(url + "/api/order/place", orderData, {
//     //     headers: { token }});

//   //     console.log("Backend response:", response.data); // Log the response

//   //     if (response.data.success) {
//   //       const { razorpay_order_id, amount, currency } = response.data;

//   //       // Trigger Razorpay Checkout
//   //       const options = {
//   //         key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Razorpay key from environment variables
//   //         amount: amount, // Amount in paise
//   //         currency: currency,
//   //         name: "Food Delivery",
//   //         description: "Place your order",
//   //         order_id: razorpay_order_id, // Order ID from backend
//   //         handler: async function (response) {
//   //           alert("Payment successful!");
//   //           console.log("Payment Response:", response);
//   //         },
//   //         prefill: {
//   //           name: `${data.firstName} ${data.lastName}`,
//   //           email: data.email,
//   //           contact: data.phone,
//   //         },
//   //         notes: {
//   //           address: `${data.street}, ${data.city}, ${data.state}, ${data.country}`,
//   //         },
//   //         theme: {
//   //           color: "#3399cc",
//   //         },
//   //       };

//   //       const rzp = new window.Razorpay(options);
//   //       rzp.on("payment.failed", function (response) {
//   //         alert("Payment failed. Please try again.");
//   //         console.error("Payment Failure:", response.error);
//   //       });

//   //       rzp.open();
//   //     } else {
//   //       alert("Error placing the order. Please try again.");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error placing the order:", error);
//   //     alert("An error occurred while placing the order. Please try again.");
//   //   }
//   // };

//   // const navigate = useNavigate();

//   // useEffect(() => {
//   //   if (!token) {
//   //     navigate("/cart");
//   //   } else if (getTotalCartAmount() === 0) {
//   //     navigate("/cart");
//   //   }
//   // }, [token]);

//   return (
//     <form className="place-order">
//       <div className="place-order-left">
//         <p className="title">Delivery Information</p>
//         <div className="multi-fields">
//           <input
//             required
//             name="firstName"
//             onChange={onChangeHandler}
//             value={data.firstName}
//             type="text"
//             placeholder="First name"
//           />
//           <input
//             required
//             name="lastName"
//             onChange={onChangeHandler}
//             value={data.lastName}
//             type="text"
//             placeholder="Last name"
//           />
//         </div>
//         <input
//           required
//           name="email"
//           onChange={onChangeHandler}
//           value={data.email}
//           type="email"
//           placeholder="Email address"
//         />
//         <input
//           required
//           name="street"
//           onChange={onChangeHandler}
//           value={data.street}
//           type="text"
//           placeholder="Street"
//         />
//         <div className="multi-fields">
//           <input
//             required
//             name="city"
//             onChange={onChangeHandler}
//             value={data.city}
//             type="text"
//             placeholder="City"
//           />
//           <input
//             required
//             name="state"
//             onChange={onChangeHandler}
//             value={data.state}
//             type="text"
//             placeholder="State"
//           />
//         </div>
//         <div className="multi-fields">
//           <input
//             required
//             name="zipcode"
//             onChange={onChangeHandler}
//             value={data.zipcode}
//             type="text"
//             placeholder="Zip Code"
//           />
//           <input
//             required
//             name="country"
//             onChange={onChangeHandler}
//             value={data.country}
//             type="text"
//             placeholder="Country"
//           />
//         </div>
//         <input
//           required
//           name="phone"
//           onChange={onChangeHandler}
//           value={data.phone}
//           type="text"
//           placeholder="Mobile No."
//         />
//       </div>
//       <div className="place-order-right">
//         <div className="cart-total">
//           <h2>Cart Totals</h2>
//           <div>
//             <div className="cart-total-details">
//               <p>Subtotal</p>
//               <p>${getTotalCartAmount()}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <p>Delivery Fee</p>
//               <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <b>Total</b>
//               <b>
//                 ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
//               </b>
//             </div>
//           </div>
//           <button type="submit">PROCEED TO PAYMENT</button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default PlaceOrder;

// End New Start

import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);
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
  });
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };
  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });
    console.log(orderItems);
  };

  //It check the cart if empty or not if empty then it not go procede
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
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
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
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
            value={data.city}
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
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

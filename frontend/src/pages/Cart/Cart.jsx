import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  let Deliverycharge = 10;
  const {
    cartItems,
    food_list,
    removeFromCart,
    addToCart,
    getTotalCartAmount,
    url,
    token,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  
  const [message, setMessage] = useState(null); // State to store message

  const totalQuantity = Object.values(cartItems).reduce(
    (acc, curr) => acc + curr,
    0
  );

  const handleCheckout = () => {
    if (totalQuantity === 0) {
      setMessage({ text: "Your cart is empty. Please add items.", type: "error" });
      setTimeout(() => setMessage(null), 3000); // Remove message after 3 seconds
    } else if (!token) {
      setMessage({ text: "You are not signed in", type: "error" });
      setTimeout(() => setMessage(null), 3000); // Remove message after 3 seconds
    } else {
      navigate("/order");
    }
  };

  return (
    <div className="cart">
      {message && (
        <div className={`custom-message ${message.type}`}>
          {message.text}
        </div>
      )}

      {totalQuantity === 0 ? (
        <div className="empty-cart">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty Cart"
            className="empty-cart-image"
          />
          <h2>Your cart is empty.</h2>
          <p>Add some delicious items to fill it up!</p>
          <button
            className="go-home-btn"
            onClick={() => navigate("/")}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Go to Home
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            <div className="cart-items-title">
              <p>Items</p>
              <p>Title</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
              <p>Remove</p>
            </div>
            <br />
            <hr />
            {food_list.map((item, index) => {
              if (cartItems[item._id] > 0) {
                return (
                  <div key={index}>
                    <div className="cart-items-title cart-items-item">
                      <img src={url + "/images/" + item.image} alt="" />
                      <p data-label="Title">{item.name}</p>
                      <p data-label="Price">${item.price}</p>
                      <div className="quantity-controls">
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span>{cartItems[item._id]}</span>
                        <button
                          onClick={() => addToCart(item._id)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      <p data-label="Total">${item.price * cartItems[item._id]}</p>
                      <p data-label="Remove"
                        onClick={() => removeFromCart(item._id)}
                        className="cross"
                      >
                        x
                      </p>
                    </div>
                    <hr />
                  </div>
                );
              }
              return null;
            })}
          </div>

          <div className="cart-bottom">
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
                  <p>${getTotalCartAmount() === 0 ? 0 : Deliverycharge}</p>
                </div>
                <hr />
                <div className="cart-total-details">
                  <b>Total</b>
                  <b>
                    ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + Deliverycharge}
                  </b>
                </div>
              </div>
              <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
            </div>

            {/* <div className="cart-promocode">
              <div>
                <p>If you have a promo code Enter it here</p>
                <div className="cart-promocode-input">
                  <input type="text"  placeholder="Promocode" />
                  <button>Submit</button>
                </div>
              </div>  
            </div> */}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
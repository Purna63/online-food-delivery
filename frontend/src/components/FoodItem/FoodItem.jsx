import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image, shopName, isAvailable, shopStatus, }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-image" src={url + "/images/" + image} alt="" />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt=""
          />
        {shopStatus === "closed" ? (
          <button className="closed-btn">Closed</button>
        ) : isAvailable === false ? (
          <button className="closed-btn">Out Of Stock</button>
        ) : !cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt=""
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt=""
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">₹{price}</p>
        <p className="shop-name">🏪 {shopName}</p>

        {shopStatus === "closed" ? (
          <p className="closed-status">🔴 Shop Closed</p>
        ) : isAvailable === false ? (
          <p className="stock-status">🟡 Out Of Stock</p>
        ) : (
          <p className="open-status">🟢 Open Now</p>
        )}
      </div>
    </div>
  );
};

export default FoodItem;

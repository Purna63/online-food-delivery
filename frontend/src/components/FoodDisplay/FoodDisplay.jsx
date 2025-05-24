import React, { useContext, useEffect, useState } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import { useLocation } from "react-router-dom";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [filteredFood, setFilteredFood] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTerm = params.get("search")?.toLowerCase().replace(/\s|-/g, "") || "";

    let result = [];

    if (searchTerm) {
      result = food_list.filter((item) =>
        item.name.toLowerCase().replace(/\s|-/g, "").includes(searchTerm)
      );
    } else if (category && category !== "All") {
      result = food_list.filter((item) => item.category === category);
    } else {
      result = food_list;
    }

    setFilteredFood(result);
  }, [location.search, food_list, category]);

  return (
    <div className="food-display" id="food-display">
      <h2>Top Dishes near you</h2>
      <div className={`food-display-list ${filteredFood.length === 0 ? "no-items" : ""}`}>
        {filteredFood.length > 0 ? (
          filteredFood.map((item, index) => (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image}
            />
          ))
        ) : (
          <div className="no-items-message">
            <img
              src="/no-food-found.png"
              alt="No food found"
              className="no-items-image"
            />
            <h3>Oops! No food found</h3>
            <p>We're sorry, but we couldn't find any matching dishes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;

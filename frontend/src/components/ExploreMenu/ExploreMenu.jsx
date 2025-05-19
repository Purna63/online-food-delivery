import React, { useState } from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";
import FoodDisplay from "../FoodDisplay/FoodDisplay";

const ExploreMenu = () => {
  const [category, setCategory] = useState("All"); // Default category

  return (
    <div>
      <div className="explore-menu" id="explore-menu">
        <h1>Discover Our Menu</h1>
        <p className="explore-menu-text">
          Fast food offers a quick and satisfying solution for your hunger, perfect for busy days and late-night cravings. With a variety of flavors and dishes, it's all about convenience without compromising on taste. All foods are collected from different restaurants in <span className="tex">Rahama Market</span>.


        </p>

        <div className="explore-menu-list">
          {menu_list.map((item, index) => (
            <div
              onClick={() => setCategory(item.menu_name)}
              key={index}
              className="explore-menu-list-item"
            >
              <img
                className={category === item.menu_name ? "active" : ""}
                src={item.menu_image}
                alt={item.menu_name}
              />
              <p>{item.menu_name}</p>
            </div>
          ))}
        </div>

        <hr />
      </div>

      {/* Pass category to FoodDisplay */}
      <FoodDisplay category={category} />
    </div>
  );
};

export default ExploreMenu;

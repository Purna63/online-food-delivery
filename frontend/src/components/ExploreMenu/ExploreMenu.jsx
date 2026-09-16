// import React, { useState } from "react";
import React, { useState, useContext } from "react";
import "./ExploreMenu.css";
// import { menu_list } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import FoodDisplay from "../FoodDisplay/FoodDisplay";

const ExploreMenu = () => {
  const [category, setCategory] = useState("All"); // Default category
  const { food_list } = useContext(StoreContext);

  // const restaurants = [
  //   ...new Set(
  //     food_list
  //       .map((item) => item.shopName?.trim())
  //       .filter(Boolean)
  //   ),
  // ];
  const restaurants = [
  ...new Map(
    food_list.map((item) => [
      item.shopName?.trim(),
      {
        shopName: item.shopName?.trim(),
        shopImage: item.shopImage,
      },
    ])
  ).values(),
];

  return (
    <div>
      <div className="explore-menu" id="explore-menu">
        <h1>About Our Food Service</h1>
        <p className="explore-menu-text">
          Fast food offers a quick and satisfying solution for your hunger, perfect for busy days and late-night cravings. With a variety of flavors and dishes, it's all about convenience without compromising on taste. All foods are collected from different restaurants in <span className="tex">Rahama Market</span> for more details contact-9777834155.


        </p>

        <hr />
        
        {/* <h1>Menu Items</h1> */}
        <h1>Restaurants</h1>

{/* <div className="explore-menu-list">

  
  <div
    onClick={() => setCategory("All")}
    className="explore-menu-list-item"
  >
    <img
      className={category === "All" ? "active" : ""}
      src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
      alt="All"
    />
    <p>All</p>
  </div>

  
{restaurants.map((shop, index) => (
  <div
    key={index}
    onClick={() => setCategory(shop.shopName)}
    className="explore-menu-list-item"
  >
<img
  src={
    shop.shopImage ||
    "https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
  }
  alt={shop.shopName}
  className={category === shop.shopName ? "active" : ""}
/>

    <p>{shop.shopName}</p>
  </div>
))}
</div> */}

        <div className="explore-menu-list">

  {/* All Menu Option */}
  <div
    onClick={() => setCategory("All")}
    className="explore-menu-list-item"
  >
    <img
      className={category === "All" ? "active" : ""}
      src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
      alt="All"
      width="70"
      height="70"
    />
    <p>All</p>
  </div>

  {/* Other Categories */}
  {restaurants.length === 0
    ? Array.from({ length: 7 }).map((_, index) => (
        <div
          key={`restaurant-placeholder-${index}`}
          className="explore-menu-list-item restaurant-placeholder"
        >
          <div className="restaurant-placeholder-image"></div>
          <div className="restaurant-placeholder-text"></div>
        </div>
      ))
    : restaurants.map((shop, index) => (
        <div
          key={index}
          onClick={() => setCategory(shop.shopName)}
          className="explore-menu-list-item"
        >
          <img
            src={
              shop.shopImage ||
              "https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
            }
            alt={shop.shopName}
            className={category === shop.shopName ? "active" : ""}
            width="70"
            height="70"
          />

          <p>{shop.shopName}</p>
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

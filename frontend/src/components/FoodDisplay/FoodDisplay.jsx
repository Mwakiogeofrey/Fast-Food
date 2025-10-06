import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../Context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category = "All" }) => {
  const { food_list } = useContext(StoreContext) || {}; // guard if context missing

  // defensive: ensure it's an array
  const foods = Array.isArray(food_list) ? food_list : [];

  // filtered list
  const visibleFoods =
    category === "All" ? foods : foods.filter((f) => f.category === category);

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>

      <div className="food-display-list">
        {visibleFoods.length === 0 ? (
          <p className="empty-msg">No dishes found{foods.length === 0 ? " — loading or no data" : ""}.</p>
        ) : (
          visibleFoods.map((item) => (
            <FoodItem
              key={item._id || item.name}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;

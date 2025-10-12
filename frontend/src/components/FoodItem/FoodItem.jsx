import React, { useState } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import FoodModal from "../FoodModal/FoodModal";
// import { url } from "../components/Constants.jsx"; // Removed, use from StoreContext

const FoodItem = ({ id, name, price, description, image }) => {
  const [itemCount, setItemCount] = useState(0);
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  // Build image src defensively:
  // - if image is a full URL, use it
  // - if image starts with '/', treat as absolute path relative to API base
  // - otherwise assume it's a filename stored on backend under /images/
  const placeholder = assets.header_img || assets.logo || "";
  const buildSrc = () => {
    if (!image) return placeholder;
    const trimmed = String(image).trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith("/")) return (url || "") + trimmed;
    // plain filename
    return (url ? url.replace(/\/$/, "") : "") + "/images/" + trimmed;
  };

  const [imgSrc, setImgSrc] = useState(buildSrc());

  const handleImgError = () => setImgSrc(placeholder);

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="food-item" onClick={() => setModalOpen(true)}>
      <div className="food-item-img-container">
        <img
          src={imgSrc}
          alt={name || "food"}
          className="food-item-image"
          onError={handleImgError}
  />
        {!cartItems[id] ? (
            <img
              className="add"
              onClick={() => addToCart(id)}
              src={assets.add_icon_white}
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
        <p className="food-item-price">${price}</p>
      </div>
      {modalOpen && <FoodModal item={{ _id: id, name, price, description, image }} onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default FoodItem;
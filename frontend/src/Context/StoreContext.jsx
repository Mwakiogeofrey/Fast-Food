import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
 const url = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));

    if (token) {
      try {
        await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
      } catch (err) {
        console.error("addToCart error:", err?.response || err);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const newCount = Math.max((prev[itemId] || 0) - 1, 0);
      return { ...prev, [itemId]: newCount };
    });

    if (token) {
      try {
        await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
      } catch (err) {
        console.error("removeFromCart error:", err?.response || err);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const qty = cartItems[itemId];
      if (!qty || qty <= 0) continue;

      const itemInfo = food_list.find((p) => String(p._id) === String(itemId));
      if (!itemInfo) {
        // Defensive logging — missing product for this id
        console.warn("getTotalCartAmount: item not found in food_list for id:", itemId);
        continue;
      }
      // guard price
      const price = Number(itemInfo.price) || 0;
      totalAmount += price * qty;
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      console.log("fetchFoodList response:", response?.data);
      // defensive: expect response.data.data or response.data
      const data = response?.data?.data ?? response?.data ?? [];
      setFoodList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchFoodList error:", err?.response || err);
      setFoodList([]);
    }
  };

  const loadCartData = async (tkn) => {
    try {
      const response = await axios.post(url + "/api/cart/get", {}, { headers: { token: tkn } });
      console.log("loadCartData response:", response?.data);
      setCartItems(response?.data?.cartData ?? {});
    } catch (err) {
      console.error("loadCartData error:", err?.response || err);
      setCartItems({});
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;

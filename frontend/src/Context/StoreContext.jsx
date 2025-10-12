// src/context/StoreContextProvider.jsx  (or path where your file is)
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const api = axios.create({ baseURL: API_BASE, timeout: 10000 });

// attach token header if present (uses 'token' header to match your backend)
api.interceptors.request.use(config => {
  const t = localStorage.getItem("token");
  if (t) config.headers.token = t;
  return config;
}, err => Promise.reject(err));

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  const addToCart = async (itemId) => {
    setCartItems(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    if (token) {
      try { await api.post("/api/cart/add", { itemId }); }
      catch (err) { console.error("addToCart error:", err?.response || err); }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems(prev => {
      const newCount = Math.max((prev[itemId] || 0) - 1, 0);
      return { ...prev, [itemId]: newCount };
    });
    if (token) {
      try { await api.post("/api/cart/remove", { itemId }); }
      catch (err) { console.error("removeFromCart error:", err?.response || err); }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const qty = cartItems[itemId];
      if (!qty || qty <= 0) continue;
      const itemInfo = food_list.find(p => String(p._id) === String(itemId));
      if (!itemInfo) { console.warn("missing product", itemId); continue; }
      const price = Number(itemInfo.price) || 0;
      totalAmount += price * qty;
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const res = await api.get("/api/food/list");
      const data = res?.data?.data ?? res?.data ?? [];
      setFoodList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchFoodList error:", err?.response || err);
      setFoodList([]);
    }
  };

  const loadCartData = async (tkn) => {
    try {
      const res = await api.post("/api/cart/get");
      setCartItems(res?.data?.cartData ?? {});
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
    food_list, cartItems, setCartItems, addToCart, removeFromCart,
    getTotalCartAmount, token, setToken, apiBase: API_BASE, url: API_BASE
  };

  return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;

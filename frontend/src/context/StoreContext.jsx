import axios from "axios";
import { createContext, useEffect, useState } from "react";

// Create context
export const StoreContext = createContext(null);
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const StoreContextProvider = (props) => {
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const initialCart = localStorage.getItem("cartItems");
  const [cartItems, setCartItems] = useState(
    initialCart ? JSON.parse(initialCart) : {}
  );

  const url = BACKEND_URL;

  const addToCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
      return updated;
    });

    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      updated[itemId]--;
      if (updated[itemId] <= 0) delete updated[itemId];
      return updated;
    });

    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const product = food_list.find((item) => item._id === itemId);
      if (product) total += product.price * cartItems[itemId];
    }
    return total;
  };

  const fetchFoodList = async () => {
    const res = await axios.get(url + "/api/food/list");
    setFoodList(res.data.data);
  };

  const loadUserCart = async () => {
    const res = await axios.post(
      url + "/api/cart/get",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.cartData) {
      setCartItems(res.data.cartData);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchFoodList();
      if (token) {
        await loadUserCart();
      }
      setLoading(false);
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    if (!token) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, token]);

  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    searchTerm,
    setSearchTerm,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

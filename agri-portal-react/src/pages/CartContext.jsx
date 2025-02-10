import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (token) {
          const response = await axios.get("http://localhost:8080/cart/view", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCount(response.data.length);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartCount();
  }, []);

  const addToCart = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("userToken");
      await axios.post(
        `http://localhost:8080/cart/add/${productId}/${quantity}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCount(prev => prev + quantity);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ count, addToCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};

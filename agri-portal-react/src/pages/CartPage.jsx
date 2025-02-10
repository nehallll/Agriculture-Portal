import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [orderMessage, setOrderMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await axios.get("http://localhost:8080/cart/view", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    
    fetchCart();
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const checkout = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.post(
        "http://localhost:8080/order/checkout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setOrderMessage("Order placed successfully!");
        setTimeout(() => navigate("/order-confirmation"), 1500);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      setOrderMessage("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-xl text-gray-400">Your cart is empty</p>
            <Link
              to="/user/buy"
              className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center py-4 border-b border-gray-700 last:border-0">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-gray-400">
                      <span>Price: Rs. {item.price.toFixed(2)}</span>
                      <span>×</span>
                      <span className="px-3 py-1 bg-gray-700 rounded-full">{item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-xl font-bold ml-4">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl">Subtotal</span>
                <span className="text-2xl font-bold text-green-400">Rs. {calculateTotal()}</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <Link
                  to="/user/buy"
                  className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300 text-center"
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={checkout}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl green-glow"
                >
                  Secure Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {orderMessage && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg text-center animate-fade-in">
            <p className="text-green-400 text-lg">{orderMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

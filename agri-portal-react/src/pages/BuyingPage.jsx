import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "./CartContext";
import { Link } from "react-router-dom";
import Header from '../components/common/Header';
import { farmingTypes } from '../farmingTypes';
import productTypes from '../productTypes';

export const BuyingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ farmingType: "", productType: "" });
  const [quantities, setQuantities] = useState({});
  const { addToCart, count } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await axios.get("http://localhost:8080/products/for-sale", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        // Fetch images for each product
        const productsWithImages = await Promise.all(
          response.data.map(async (product) => {
            try {
              const imageResponse = await axios.get(
                `http://localhost:8080/products/image/${product.id}`,
                {
                  headers: token ? { Authorization: `Bearer ${token}` } : {},
                  responseType: 'arraybuffer'
                }
              );
              
              const base64Image = btoa(
                new Uint8Array(imageResponse.data).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  ''
                )
              );
              return {
                ...product,
                productImage: `data:${imageResponse.headers['content-type']};base64,${base64Image}`
              };
            } catch (imageError) {
              return product;
            }
          })
        );
        
        setProducts(productsWithImages);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantities({ ...quantities, [productId]: value });
  };

  const filteredProducts = products.filter(
    (p) =>
      (!filters.farmingType || p.farmingType === filters.farmingType) &&
      (!filters.productType || p.productType === filters.productType)
  );

  if (loading) {
    return <div className="p-4 text-white">Loading products...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-10">
        <h1 className="text-2xl font-bold mb-4">Available Products</h1>

        {/* Filters */}
        <div className="mb-8 flex gap-4 flex-wrap">
          <select
            onChange={(e) => setFilters({ ...filters, farmingType: e.target.value })}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Farming Types</option>
            {farmingTypes.map(type => (
              <option key={type} value={type.toUpperCase()}>
                {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => setFilters({ ...filters, productType: e.target.value })}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Product Types</option>
            {productTypes.map(type => (
              <option key={type} value={type.toUpperCase()}>
                {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-all">
                <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                  {product.productImage ? (
                    <img 
                      src={product.productImage}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{product.productName}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-green-400">Rs.{product.price}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={quantities[product.id] || 1}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                      className="w-20 bg-gray-900 text-white px-3 py-1 rounded text-center"
                    />
                  </div>
                </div>
                
                <button
                  onClick={async () => {
                    const quantity = parseInt(quantities[product.id]) || 1;
                    try {
                      const token = localStorage.getItem("userToken");
                      await axios.post(
                        `http://localhost:8080/cart/add/${product.id}/${quantity}`,
                        {},
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      addToCart(product.productName, product.price, quantity);
                    } catch (error) {
                      console.error("Error adding to cart:", error);
                    }
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-400">
              No products available matching your filters
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart Button */}
      <Link
        to="/cart"
        className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center space-x-2"
      >
        🛒 <span>Cart</span>
      </Link>
    </div>
  );
};

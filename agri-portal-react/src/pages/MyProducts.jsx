import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/common/Header';

export default function MyProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:8080/products/user-products', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch images for each product
        const productsWithImages = await Promise.all(
          response.data.map(async (product) => {
            try {
              const imageResponse = await axios.get(`http://localhost:8080/products/image/${product.id}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'arraybuffer'
              });
              
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
              return product; // Return product without image if fetch fails
            }
          })
        );

        setProducts(productsWithImages);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProducts();
  }, [navigate]);

  // Auto-hide success messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSellProduct = async (productId, updatedPrice, stockToSell) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.put(
        `http://localhost:8080/products/mark-sale/${productId}`,
        { price: updatedPrice, stockToSell },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, price: updatedPrice, stockToSell, markedForSale: true }
            : product
        )
      );
      
      setSuccessMessage('Product marked for sale successfully!');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
      setSuccessMessage(null);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`http://localhost:8080/products/delete/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
      setSuccessMessage('Product deleted successfully!');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
      setSuccessMessage(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-white mb-8 mt-12">My Products</h1>
        
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-500 text-white rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded-lg">
            Error: {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full bg-gray-800 text-white">
              {/* ... rest of the table code remains the same ... */}
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Product Image</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Product Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Product Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Total Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Stock to Sell</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Metric</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Farming Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Land Area</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-700">
                    {/* ... rest of the table body remains the same ... */}
                    <td className="px-4 py-3">
                      <img
                        src={product.productImage}
                        alt={product.productName}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">{product.productName}</td>
                    <td className="px-4 py-3 text-sm">{product.productType}</td>
                    <td className="px-4 py-3 text-sm">
                      <input
                        type="number"
                        defaultValue={product.price}
                        onChange={(e) => {
                          const updatedPrice = parseFloat(e.target.value);
                          setProducts((prevProducts) =>
                            prevProducts.map((p) =>
                              p.id === product.id ? { ...p, price: updatedPrice } : p
                            )
                          );
                        }}
                        className="bg-gray-700 text-white px-2 py-1 rounded text-sm w-20"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">{product.totalStock}</td>
                    <td className="px-4 py-3 text-sm">
                      <input
                        type="number"
                        defaultValue={product.stockToSell}
                        onChange={(e) => {
                          const stockToSell = parseInt(e.target.value);
                          setProducts((prevProducts) =>
                            prevProducts.map((p) =>
                              p.id === product.id ? { ...p, stockToSell } : p
                            )
                          );
                        }}
                        className="bg-gray-700 text-white px-2 py-1 rounded text-sm w-20"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">{product.metric}</td>
                    <td className="px-4 py-3 text-sm">{product.farmingType}</td>
                    <td className="px-4 py-3 text-sm">{product.landArea}</td>
                    <td className="px-4 py-3 text-sm space-x-2">
                      <button
                        onClick={() => handleSellProduct(product.id, product.price, product.stockToSell)}
                        className="px-3 py-1 bg-green-500 rounded-lg hover:bg-green-600 transition-colors text-sm"
                      >
                        Sell
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="px-3 py-1 bg-red-500 rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

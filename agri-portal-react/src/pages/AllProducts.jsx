import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import Header from '../components/common/Header';

export default function AllProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all products
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          navigate('/admin/login');
          return;
        }

        const response = await axios.get('http://localhost:8080/products/view', {
          headers: { Authorization: `${token}` },
        });

        // Fetch images for each product
        const productsWithImages = await Promise.all(
          response.data.map(async (product) => {
            try {
              const imageResponse = await axios.get(
                `http://localhost:8080/products/image/${product.id}`,
                {
                  headers: { Authorization: `${token}` },
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
              return product; // Return product without image if fetch fails
            }
          })
        );

        setProducts(productsWithImages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-20">
        <h1 className="text-3xl font-bold text-white mb-8">All Products</h1>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full bg-gray-800 text-white">
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
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-700">
                    <td className="px-4 py-3">
                      {product.productImage ? (
                        <img
                          src={product.productImage}
                          alt={product.productName}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-400">No Image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">{product.productName}</td>
                    <td className="px-4 py-3 text-sm">{product.productType}</td>
                    <td className="px-4 py-3 text-sm">{product.price}</td>
                    <td className="px-4 py-3 text-sm">{product.totalStock}</td>
                    <td className="px-4 py-3 text-sm">{product.stockToSell}</td>
                    <td className="px-4 py-3 text-sm">{product.metric}</td>
                    <td className="px-4 py-3 text-sm">{product.farmingType}</td>
                    <td className="px-4 py-3 text-sm">{product.landArea}</td>
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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer'; // Assuming you have a Footer component
import { farmingTypes } from '../farmingTypes';
import productTypes from '../productTypes';

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '',
    productType: '',
    farmingType: '',
    totalStock: '',
    metric: '',
    landArea: '',
  });
  const [productImage, setProductImage] = useState(null); // State for the image file
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]); // Set the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.productName ||
      !formData.productType ||
      !formData.farmingType ||
      !formData.totalStock ||
      !formData.metric ||
      !formData.landArea
    ) {
      setError('All fields are required.');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('product', JSON.stringify(formData)); // Append the product JSON
      if (productImage) {
        formDataToSend.append('productImage', productImage); // Append the image file if it exists
      }

      const response = await fetch('http://localhost:8080/products/add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`, // Include user token for authentication
        },
        body: formDataToSend, // Send FormData instead of JSON
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const result = await response.json();
      console.log('Product added successfully:', result);
      navigate('/users/my-products'); // Redirect to My Products page after successful addition
    } catch (error) {
      setError('Failed to add product. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <br />
      <br />
      <br />
      <br />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-6">Add New Product</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Product Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300">Product Type</label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>Select Product Type</option>
                  {productTypes.map((type) => (
                    <option key={type} value={type.toUpperCase()}>
                      {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Farming Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300">Farming Type</label>
                <select
                  name="farmingType"
                  value={formData.farmingType}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>Select Farming Type</option>
                  {farmingTypes.map((type) => (
                    <option key={type} value={type.toUpperCase()}>
                      {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-300">Total Stock</label>
                <input
                  type="number"
                  name="totalStock"
                  value={formData.totalStock}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Metric */}
              <div>
                <label className="block text-sm font-medium text-gray-300">Metric</label>
                <select
                  name="metric"
                  value={formData.metric}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>Select Metric</option>
                  <option value="KG">KG</option>
                  <option value="L">L</option>
                  <option value="UNIT">UNIT</option>
                </select>
              </div>

              {/* Land Area */}
              <div>
                <label className="block text-sm font-medium text-gray-300">Land Area (in acres)</label>
                <input
                  type="number"
                  name="landArea"
                  value={formData.landArea}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Product Image */}
              <div>
                <label className="block text-sm font-medium text-gray-300">Product Image</label>
                <input
                  type="file"
                  name="productImage"
                  onChange={handleImageChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
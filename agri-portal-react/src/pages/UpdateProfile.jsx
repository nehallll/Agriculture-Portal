import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/common/Header';

export default function UpdateProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    role: '',
    farmingType: '',
    adrLine1: '',
    adrLine2: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal"
  ];

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
    } else {
      fetchUserData();
    }
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/users/get-user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      if(response.data.role === 'ROLE_FARMER')
        {
          response.data.role = "Farmer"
        } 
        else{
          response.data.role = "Merchant"
        }
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:8080/users/update-profile', userData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      if (response.status === 200) {
        alert('Profile updated successfully!');
        navigate('/users/dashboard');
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-6">Update Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg p-3"
                  disabled
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg p-3"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg p-3"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Gender</label>
                <select
                  name="gender"
                  value={userData.gender}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg p-3"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Role</label>
                <input
                  type="text"
                  name="role"
                  value={userData.role}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg p-3"
                  disabled
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Farming Type</label>
                <input
                  type="text"
                  name="farmingType"
                  value={userData.farmingType}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg p-3"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Address Line 1</label>
                <input
                  type="text"
                  name="adrLine1"
                  value={userData.adrLine1}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg p-3"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Address Line 2</label>
                <input
                  type="text"
                  name="adrLine2"
                  value={userData.adrLine2}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg p-3"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={userData.city}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg p-3"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">State</label>
                <select
                  name="state"
                  value={userData.state}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg p-3"
                >
                  {states.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={userData.zipCode}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg p-3"
                />
              </div>
            </div>
            <div className="mt-8">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

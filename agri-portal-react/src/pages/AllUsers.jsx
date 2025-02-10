import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/common/Header';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('http://localhost:8080/users/list', {
          headers: {
            Authorization: `${token}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeactivate = async (userId) => {
    try {
      await axios.delete(`http://localhost:8081/users/${userId}`, {
        headers: {
          Authorization: localStorage.getItem('adminToken')
        }
      });
      // Refresh the user list after deactivation
      const response = await axios.get('http://localhost:8081/users/list', {
        headers: {
          Authorization: localStorage.getItem('adminToken')
        }
      });
      setUsers(response.data);
      alert('User deactivated successfully');
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert('Error deactivating user');
    }
  };

  if (loading) {
    return <div className="p-4 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <h1 className="text-2xl font-bold mb-4 py-16 text-white">User Management</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 border rounded-lg">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">ID</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Name</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Mobile</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Gender</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Status</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Role</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Farming Type</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">State</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700">
                  <td className="py-3 px-3 border-b">{user.id}</td>
                  <td className="py-3 px-3 border-b">{user.firstName} {user.lastName}</td>
                  <td className="py-3 px-3 border-b">{user.email}</td>
                  <td className="py-3 px-3 border-b">{user.mobile}</td>
                  <td className="py-3 px-3 border-b">{user.gender}</td>
                  <td className="py-3 px-3 border-b">{user.status ? 'Active' : 'Inactive'}</td>
                  <td className="py-3 px-3 border-b">{user.role}</td>
                  <td className="py-3 px-3 border-b">{user.farmingType}</td>
                  <td className="py-3 px-3 border-b">{user.state}</td>
                  <td className="py-3 px-3 border-b">
                    {user.status && (
                      <button
                        onClick={() => handleDeactivate(user.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-4 text-white">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
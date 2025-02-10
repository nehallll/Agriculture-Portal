import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import { 
  UserGroupIcon,
  ChartBarSquareIcon,
  CubeIcon,
  UserCircleIcon,
  ArrowPathIcon,
  PlusIcon, 
} from '@heroicons/react/24/outline';

export default function UserDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const dashboardItems = [
    { title: 'Add New Product', path: '/users/add-product', icon: PlusIcon, color: 'bg-orange-500' }, 
    { title: 'My Products', path: '/users/my-products', icon: UserGroupIcon, color: 'bg-purple-500' },
    { title: 'My Cart', path: '/cart', icon: ChartBarSquareIcon, color: 'bg-emerald-500' },
    { title: 'Previous Orders', path: '/users/orders', icon: CubeIcon, color: 'bg-cyan-500' },
    { title: 'Update Profile', path: '/users/update-profile', icon: UserCircleIcon, color: 'bg-pink-500' },
    { title: 'Change Password', path: '/users/change-password', icon: ArrowPathIcon, color: 'bg-rose-500' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900">
        <Header/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardItems.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className="group relative text-white cursor-pointer rounded-xl bg-gray-800 p-6 transition-all duration-300 
                hover:bg-white hover:text-gray-900"
              >
                <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-red-500 transition-colors 
            group hover:shadow-lg"
          >
            <span className="text-gray-300 group-hover:text-white font-medium">Logout</span>
          </button>
        </div>
      </div>
  );
}
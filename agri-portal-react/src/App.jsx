import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import FarmerLogin from './pages/FarmerLogin';
import FarmerSignup from './pages/FarmerSignup';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminRegister';
import LearnPage from './pages/LearnPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import ResetAdminPassword from './pages/ResetAdminPassword';
import AdminUpdate from './pages/AdminUpdate';
import AllUsers from './pages/AllUsers';
import UserDashboard from './pages/UserDashboard';
import AddNewProduct from './pages/AddNewProduct'; 
import ChangePassword from './pages/ChangePassword';
import UpdateProfile from './pages/UpdateProfile';
import MyProducts from './pages/MyProducts';
import AllProducts from './pages/AllProducts';
import { BuyingPage } from "./pages/BuyingPage";
import { CartPage } from "./pages/CartPage";
import { CartProvider } from "./pages/CartContext";
import { OrderConfirmation } from "./pages/OrderConfirmation";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/home" element={<HomePage/>} />
          <Route path="/login" element={<FarmerLogin/>}/>
          <Route path="/signup" element={<FarmerSignup/>}/>
          <Route path="/adminlogin" element={<AdminLogin/>}/>
          <Route path="/adminregister" element={<AdminSignup/>}/>
          <Route path="/learn" element={<LearnPage/>}/>
          <Route path="/about" element={<AboutPage/>}/>
          <Route path="/contact" element={<ContactPage/>}/>
          <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
          <Route path='/admin/reset-password' element={<ResetAdminPassword/>}/>
          <Route path='/admin/update' element={<AdminUpdate/>}/>
          <Route path='/admin/users' element={<AllUsers/>}/>
          <Route path='/users/dashboard' element={<UserDashboard/>} />
          <Route path='/users/add-product' element={<AddNewProduct/>} /> 
          <Route path='/users/change-password' element={<ChangePassword/>} />
          <Route path='/users/update-profile' element={<UpdateProfile/>} />
          <Route path="/users/my-products" element={<MyProducts />} />
          <Route path="/admin/all-products" element={<AllProducts />} />
          <Route path="/user/buy" element={<BuyingPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;

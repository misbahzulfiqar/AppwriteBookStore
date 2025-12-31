import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/applayout/main/Mainlayout';
import Login from '../forms/Login';
import Signup from '../forms/Signup';
import VerifyEmail from '../forms/Verification'
import ResetPassword from '../forms/ResetPassword'

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify" element={<VerifyEmail />} /> 
      <Route path="/reset-password" element={<ResetPassword />} /> 
    </Routes>
  );
};

export default AllRoutes;
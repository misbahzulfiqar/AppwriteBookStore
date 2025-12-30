import { Routes, Route } from 'react-router-dom';
import MainLayout from '../Layouts/Applayout/Main/Mainlayout';
import Login from '../Forms/Login';
import Signup from '../Forms/Signup';
import VerifyEmail from '../Forms/Verification'
import ResetPassword from '../Forms/ResetPassword'

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
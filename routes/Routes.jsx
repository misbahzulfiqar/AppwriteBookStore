import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/applayout/main/Mainlayout';
import Login from '../forms/Login';
import Signup from '../forms/Signup';
import VerifyEmail from '../forms/Verification'
import ResetPassword from '../forms/ResetPassword'
import Library from '../components/library/Library'
import PDFReaderPage from '../components/library/pdfReaderPage';

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify" element={<VerifyEmail />} /> 
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/library" element={<Library />} />
      <Route path="/reader/:bookId" element={<PDFReaderPage />} />
    </Routes>
  );
};

export default AllRoutes;
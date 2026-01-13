import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/Mainlayout";
import Login from "../forms/Login";
import Signup from "../forms/Signup";
import VerifyEmail from "../forms/Verification";
import ResetPassword from "../forms/ResetPassword";
import Library from "../components/library/Library";
import PDFReaderPage from "../components/library/pdfReaderPage";
import HomePage from "../pages/home";
import AuthLayout from "../layouts/AuthLayout";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} /> */}
        <Route path="/library" element={<Library />} />
        <Route path="/reader/:bookId" element={<PDFReaderPage />} />
      </Route>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="verify" element={<VerifyEmail />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>
    </Routes>
  );
};

export default AllRoutes;

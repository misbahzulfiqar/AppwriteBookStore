import React from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import BottomNavbar from "./applayout/main/BottomNavbar";
import { Navigate, Outlet } from "react-router-dom";
import "./applayout/styles/styles.css";
import { useSelector } from "react-redux";

const MainLayout = () => {
  const { userData } = useSelector((state) => state.auth);

  if (!userData) {
    // console.log("userData", userData);
    return <Navigate to="/auth/login" />;
  }

  return (
    <div className="w-full h-full">
      <Header />
      <div className="mx-auto max-w-[1400px]">
        <Outlet />
      </div>
      <Footer />
      <BottomNavbar />
    </div>
  );
};

export default MainLayout;

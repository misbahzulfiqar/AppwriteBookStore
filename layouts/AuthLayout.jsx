import React from "react";
import { Outlet } from "react-router-dom";
import "./applayout/styles/styles.css";

const AuthLayout = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Outlet />
    </div>
  );
};

export default AuthLayout;

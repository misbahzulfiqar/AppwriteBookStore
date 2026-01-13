import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutBtn from "../../forms/Logout";
import { navlinks } from "../../constants";

const Header = () => {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  return (
    <header className="sticky top-0 z-50 bg-[#8b5a2b] shadow-xl shadow-black/50">
      <div className="px-6">
        <div
          className="flex items-center justify-between h-18"
          style={{ margin: "0 20px 0px" }}
        >
          <Link
            to="/"
            className="flex items-center gap-2 text-white font-bold text-xl no-underline"
          >
            <i className="text-4xl">📚</i>
            <span className="text-2xl">BookGlow</span>
          </Link>

          <nav className="absolute left-1/2 transform -translate-x-1/2 flex gap-8 text-lg font-medium">
            {/* {navlinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-white hover:text-[#d8b993] transition no-underline"
              >
                {link.name}
              </Link>
            ))} */}
            {/* TODO: using an a tag */}
            {navlinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white hover:text-[#d8b993] transition no-underline"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="flex gap-3">
            {authStatus ? (
              <>
                <Link
                  to="/library"
                  className="bg-[#a67c52] text-white rounded-sm cursor-pointer hover:bg-[#b28c65] transition-colors h-10 w-25 btn-margin text-center"
                >
                  📚 Library
                </Link>
                <LogoutBtn />
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/auth/login")}
                  className="bg-[#a67c52] text-white rounded-sm cursor-pointer hover:bg-[#b28c65] transition-colors h-10 w-20 px-4"
                >
                  Login
                </button>

                <button
                  onClick={() => navigate("/auth/signup")}
                  className="bg-[#a67c52] text-white rounded-sm cursor-pointer hover:bg-[#b28c65] transition-colors h-10 w-20 px-4"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

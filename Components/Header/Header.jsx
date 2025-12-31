import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
const Header = () => {
  const navigate = useNavigate(); 

  return (
    <header className="sticky top-0 z-50 bg-[#8b5a2b] shadow-md">
      <div className="px-6">
        <div className="flex items-center justify-between h-18" style={{margin: '0 20px 0px'}}>

          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl no-underline">
            <i className="text-4xl">📚</i>
            <span className="text-2xl">BookGlow</span>
          </Link>

          <nav className="absolute left-1/2 transform -translate-x-1/2 flex gap-8 text-lg font-medium">
            <Link to="/" className="text-white hover:text-[#d8b993] transition no-underline">Home</Link>
            <Link to="/about" className="text-white hover:text-[#d8b993] transition no-underline">About Us</Link>
            <Link to="/featured" className="text-white hover:text-[#d8b993] transition no-underline">Featured</Link>
            <Link to="/reviews" className="text-white hover:text-[#d8b993] transition no-underline">Reviews</Link>
            <Link to="/contact" className="text-white hover:text-[#d8b993] transition no-underline">Contact</Link>
          </nav>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
<<<<<<< HEAD
              className="`h-7.5` `w-15` bg-[#a67c52] text-white rounded-sm cursor-pointer hover:bg-[#b28c65] transition-colors"
=======
              className="h-[30px] w-[60px] bg-[#a67c52] text-white rounded-sm cursor-pointer hover:bg-[#b28c65] transition-colors"
>>>>>>> 4ee818fb7628ac74c4602c81b05000021aa4ba92
            >
              Login
            </button>
            
            <button
              onClick={() => navigate('/signup')}
<<<<<<< HEAD
              className="h-7.5` `w-15` bg-[#a67c52] text-white rounded-sm cursor-pointer hover:bg-[#b28c65] transition-colors"
=======
              className="h-[30px] w-[60px] bg-[#a67c52] text-white rounded-sm cursor-pointer hover:bg-[#b28c65] transition-colors"
>>>>>>> 4ee818fb7628ac74c4602c81b05000021aa4ba92
            >
              Sign Up
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
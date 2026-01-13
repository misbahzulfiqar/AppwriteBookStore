import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authService from '../appwrite/auth/authService';
import { logout as authLogout } from '../appwrite/auth/authSlice';

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await authService.logout();
      dispatch(authLogout());
      navigate('/login'); // optional: redirect to login page after logout
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Failed to logout. Please try again.');
    }
  };

  return (
    <button
      className="bg-[#a67c52] text-white rounded-sm cursor-pointer hover:bg-[#b28c65] transition-colors h-10 w-20 px-4"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;

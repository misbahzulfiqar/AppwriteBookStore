import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authService from '../../appwrite/authService';
import { logout as authLogout } from '../../store/authSlice';

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
      className="inline-block px-6 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition duration-200"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;

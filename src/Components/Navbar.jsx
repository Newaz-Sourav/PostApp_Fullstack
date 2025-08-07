import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Menu, X } from 'lucide-react'; // lucide-react install করা লাগবে

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [username,setusername]=useState("");

 const handlelogout = () => {
  axios
    .get('https://backend-postapp.onrender.com/logout', { withCredentials: true })
    .then((res) => {
      console.log(res.data); // optional
      window.location.href = "/";
    })
    .catch((err) => {
      console.error("Logout failed", err);
    });
};


  useEffect(() => {
    axios
      .get('https://backend-postapp.onrender.com/profile', { withCredentials: true })
      .then((res) => {
        if (res.data) {
          setIsLoggedIn(true);
          setusername(res.data.name);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg text-white px-4 sm:px-6 py-3">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide hover:opacity-90">
          📝 PostApp
        </Link>

        {/* Hamburger button (only on mobile) */}
        <button
          className="sm:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Buttons */}
        <div className="hidden sm:flex items-center gap-4">
          {isLoggedIn && (
            <Link
              to="/profile"
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 transition rounded-xl font-medium shadow"
            >
              {username}
            </Link>
          )}

          {isLoggedIn ? (
            <div 
            
            onClick={() => {
                handlelogout();
                setIsLoggedIn(false);
              }}

            className="px-4 py-2 bg-white text-indigo-600 rounded-xl font-medium shadow hover:bg-gray-100 transition cursor-pointer">
              Logout
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-white text-indigo-600 rounded-xl font-medium shadow hover:bg-gray-100 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden mt-3 flex flex-col gap-3">
          {isLoggedIn && (
            <Link
              to="/profile"
              className="block px-4 py-2 bg-indigo-500 hover:bg-indigo-400 rounded-xl font-medium text-center shadow"
              onClick={toggleMenu}
            >
              {username}
            </Link>
          )}
          {isLoggedIn ? (
            <div

              onClick={() => {
                toggleMenu();
                handlelogout();
                setIsLoggedIn(false);
              }}
              className="block px-4 py-2 bg-white text-indigo-600 rounded-xl font-medium text-center shadow hover:bg-gray-100 cursor-pointer"
            >
              Logout
            </div>
          ) : (
            <Link
              to="/login"
              className="block px-4 py-2 bg-white text-indigo-600 rounded-xl font-medium text-center shadow hover:bg-gray-100"
              onClick={toggleMenu}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;

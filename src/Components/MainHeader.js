import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "./Contexts/DataContext";
import { Menu, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "./Images/logo.png";

const MainHeader = () => {
  const [showSignup, setShowSignup] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useContext(DataContext);
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/registration");
  };

  useEffect(() => {
    // isUserLoggedin();
    if (user) {
      setShowSignup(false);
    } else {
      setShowSignup(true);
    }
  }, [user]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      className="text-gray-700 hover:text-indigo-600 transition py-2 px-4 block lg:inline-block font-medium"
      activeClassName="text-blue-200"
    >
      {children}
    </NavLink>
  );
  return (
    <div>
      <header className="bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 p-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1
            className="text-2xl font-bold cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-xl font-bold flex items-center"
            onClick={() => navigate("/")}
          >
             <img
              onClick={() => navigate("/")}
              src={logo}
              alt="logo"
              className="w-12  mr-2" // Adjust size of the image
            />
            CareerRoadAI
          </h1>
          <nav className="hidden lg:block">
            <NavItem to="/course/topic">Courses</NavItem>
            <NavItem to="/about-us">About</NavItem>
            <NavItem to="/roadmap">Roadmap</NavItem>
            <NavItem to="/profile">Dashboard</NavItem>
            {showSignup && (
              <button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded hover:bg-blue-100 transition duration-300"
                onClick={handleSignup}
              >
                Sign Up
              </button>
            )}
          </nav>
          <button className="lg:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-indigo-50 via-purple-50 py-2">
          <nav className="container mx-auto flex flex-col">
            <NavItem to="/course/topic">Courses</NavItem>
            <NavItem to="/about-us">About</NavItem>
            <NavItem to="/roadmap">Roadmap</NavItem>
            <NavItem to="/profile">Dashboard</NavItem>
            {showSignup && (
              <button
                className="bg-white text-blue-600 px-4 py-2 m-2 rounded hover:bg-blue-100 transition duration-300"
                onClick={handleSignup}
              >
                Sign Up
              </button>
            )}
          </nav>
        </div>
      )}
    </div>
  );
};

export default MainHeader;

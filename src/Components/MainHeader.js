import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "./Contexts/DataContext";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  const NavItem = ({ href, children }) => (
    <a
      href={href}
      className="text-white hover:text-blue-200 py-2 px-4 block lg:inline-block"
    >
      {children}
    </a>
  );
  return (
    <div>
      <header className="bg-blue-600 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1
            className="text-2xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            CareerRoadAI
          </h1>
          <nav className="hidden lg:block">
            <NavItem href="/course/topic">Courses</NavItem>
            <NavItem href="/About-us">About</NavItem>
            <NavItem href="/roadmap">Roadmap</NavItem>
            <NavItem href="/profile">Dashboard</NavItem>
            {showSignup && (
              <button
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition duration-300"
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
        <div className="lg:hidden bg-blue-500 py-2">
          <nav className="container mx-auto flex flex-col">
            <NavItem href="/course/topic">Courses</NavItem>
            <NavItem href="/About-us">About</NavItem>
            <NavItem href="/roadmap">Roadmap</NavItem>
            <NavItem href="/profile">Dashboard</NavItem>
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
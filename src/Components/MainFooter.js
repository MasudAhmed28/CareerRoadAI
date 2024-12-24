import React from "react";
import { useNavigate } from "react-router-dom";

const MainFooter = () => {
  const navigate = useNavigate();

  return (
    <div>
      <footer className="bg-gray-800 text-white p-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 CareerRoadAI Platform. All rights reserved.</p>
          <div className="mt-4">
            <button
              onClick={() => navigate("/privacy-policy")}
              className="text-blue-300 hover:text-blue-100 mx-2"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate("/terms&condition")}
              className="text-blue-300 hover:text-blue-100 mx-2"
            >
              Terms of Service
            </button>
            <button
              onClick={() => navigate("/contactCareerRoadAITeam")}
              className="text-blue-300 hover:text-blue-100 mx-2"
            >
              Contact Us
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainFooter;

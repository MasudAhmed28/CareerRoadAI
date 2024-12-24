import React from "react";

const LoadSpinner = ({ text }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-4 mx-auto"></div>
        <p className="text-gray-700 text-lg">{text}...</p>
      </div>
    </div>
  );
};

export default LoadSpinner;

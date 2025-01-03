import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      setError("");
      setSuccess(false);
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Forgot Password
        </h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
        />
        <button
          onClick={handleResetPassword}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Send Reset Email
        </button>

        {success && (
          <div>
            <p className="text-green-500 mt-4 text-center">
              Email sent! Please check your inbox.
            </p>
          </div>
        )}
        {error && (
          <p className="text-red-500 mt-4 text-center">Error: {error}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

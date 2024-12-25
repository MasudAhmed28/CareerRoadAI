import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignInwithGoogle from "./SignInwithGoogle";
import axios from "axios";
import { backendUrl } from "../BackendUrl";
import {Link, useNavigate } from "react-router-dom";
import LoadSpinner from "./LoadSpinner";

const Registration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
     setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      const firebaseUID = user.uid;

      const response = await axios.post(`${backendUrl}/createUser`, {
        name,
        email,
        firebaseUID,
      });

      if (response.status === 201) {
        toast.success("Registered successfully", {
          position: "top-center",
          autoClose: 5000,
        });
        navigate("/");
        setName("");
        setEmail("");
        setPassword("");
      } else if (response.status === 201) {
        navigate("/");
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.log(error.message);
      let errorMessage = "";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage =
            "This email is already registered. Please try logging in.";
          break;
        case "auth/invalid-email":
          errorMessage =
            "The email address is invalid. Please enter a valid email.";
          break;
        case "auth/weak-password":
          errorMessage =
            "The password is too weak. Please choose a stronger password.";
          break;
        default:
          errorMessage = "An unexpected error occurred. Please try again.";
      }
      toast.error("Registration failed: " + errorMessage, {
        position: "top-center",
        autoClose: 5000,
      });
    }finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <LoadSpinner text="Please wait while we create your account" />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleRegistration}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Register
          </button>
        </form>
        <p style={{ textAlign: "center" }}>
          Already an User ?
           <Link style={{ color: "blue" }} to="/login">
            Login Here
          </Link>
        </p>
        <div className="mt-4">
          <SignInwithGoogle />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Registration;

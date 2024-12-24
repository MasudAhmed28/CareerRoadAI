import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../BackendUrl";
import { toast } from "react-toastify";

const SignInwithGoogle = () => {
  const navigate = useNavigate();

  async function googleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await createBackendUser(
          result.user.displayName,
          result.user.email,
          result.user.uid
        );
        toast.success("Logged in successfully", { position: "top-center" });
        navigate("/");
      }
    } catch (error) {
      console.error("Google login error:", error);
      handleAuthError(error); // Custom error handler
    }
  }

  async function createBackendUser(name, email, firebaseUID) {
    try {
      const response = await axios.post(`${backendUrl}/createUser`, {
        name,
        email,
        firebaseUID,
      });
      if (response.status === 200 || response.status === 201) {
        console.log("User successfully created in backend.");
      } else {
        console.error("Error creating MongoDB user:", response.data);
        toast.error("Failed to save user to backend.", {
          position: "bottom-center",
        });
      }
    } catch (error) {
      console.error("Error during backend user creation:", error);
      toast.error("Could not connect to the server.", {
        position: "bottom-center",
      });
    }
  }

  function handleAuthError(error) {
    let errorMessage = "An unexpected error occurred.";
    switch (error.code) {
      case "auth/popup-closed-by-user":
        errorMessage = "Login popup was closed before completing sign-in.";
        break;
      case "auth/cancelled-popup-request":
        errorMessage = "Multiple login popups are not allowed.";
        break;
      case "auth/network-request-failed":
        errorMessage = "Network error. Please check your internet connection.";
        break;
      default:
        errorMessage = error.message || "Failed to sign in with Google.";
    }
    toast.error(errorMessage, { position: "bottom-center" });
  }

  return (
    <div>
      <p style={{ textAlign: "center", color: "grey" }}>--or continue with--</p>
      <div
        style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
        onClick={googleLogin}
      >
        <img
          src={require("./Images/google.png")}
          width={"60%"}
          height={"40%"}
          alt="google sign in"
        />
      </div>
    </div>
  );
};

export default SignInwithGoogle;

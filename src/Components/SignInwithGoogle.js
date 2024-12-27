import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../BackendUrl";
import { toast } from "react-toastify";

const SignInWithGoogle = ({ setLoading, setLoadingMessage, setTip }) => {
  const navigate = useNavigate();
  
  async function googleLogin() {
    setLoading(true);
    setLoadingMessage("Connecting to Google...");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        setLoadingMessage("Connecting to Google......");
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
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  }

  async function createBackendUser(name, email, firebaseUID) {
    setLoadingMessage("Hang tight, setting things up......");
    try {
      const response = await axios.post(`${backendUrl}/createUser`, {
        name,
        email,
        firebaseUID,
      });
      if (response.status === 200) {
        console.log("User successfully created in backend.");
       setLoadingMessage("Almost there, preparing your dashboard...");
      }
    } catch (error) {
      console.error("Error during backend user creation:", error);
      throw error;
    }finally {
      setLoadingMessage("Finalizing your login experience......");
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

export default SignInWithGoogle;

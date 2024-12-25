import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SignInwithGoogle from "./SignInwithGoogle";
import LoadSpinner from "./LoadSpinner";

const Login = () => {
  const [formdata, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

   const handleFormSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    await signInWithEmailAndPassword(auth, formdata.email, formdata.password)
      .then((userCredential) => {
        toast.success("User logged in successfully", {
          position: "top-center",
        });
        console.log(userCredential.user);
        setTimeout(() => navigate("/"), 1000);
      })
      .catch((error) => {
        let errorMessage = "An error occurred. Please try again.";

        switch (error.code) {
          case "auth/invalid-credential":
            errorMessage =
              "The email address or Password is not valid. Please enter a valid email.";
            break;
          case "auth/user-disabled":
            errorMessage =
              "Your account has been disabled. Please contact support.";
            break;
          case "auth/user-not-found":
            errorMessage =
              "No account found with this email. Please check your email or register.";
            break;
          case "auth/wrong-password":
            errorMessage = "Incorrect password. Please try again.";
            break;
          case "auth/network-request-failed":
            errorMessage =
              "Network error. Please check your connection and try again.";
            break;
          default:
            errorMessage =
              "An unexpected error occurred. Please try again later.";
        }
        toast.error(errorMessage, { position: "top-center" });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  if (loading) {
    return <LoadSpinner text="Logging you in" />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formdata.email}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formdata.password}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
        <p style={{ textAlign: "center" }}>
          Not an User ?
           <Link style={{ color: "blue" }} to="/registration">
            Register Here
         </Link>
        </p>
        <div className="mt-4">
          <SignInwithGoogle />
        </div>
      </div>
    </div>
  );
};

export default Login;

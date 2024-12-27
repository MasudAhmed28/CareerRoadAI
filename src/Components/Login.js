import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SignInwithGoogle from "./SignInwithGoogle";
import { Loader2 } from "lucide-react";
import { getRandomTip } from "./Util";

const Login = () => {
  const [formdata, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [currentTip, setCurrentTip] = useState("");
  const [loadStartTime, setLoadStartTime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading && !loadStartTime) {
      setLoadStartTime(Date.now());
    }
    if (!loading && loadStartTime) {
      setLoadStartTime(null);
    }
  }, [loading, loadStartTime]);

  useEffect(() => {
    if (loading && loadStartTime) {
      const tipInterval = setInterval(() => {
        setCurrentTip(getRandomTip());
      }, 4000);

      return () => clearInterval(tipInterval);
    }
  }, [loading, loadStartTime]);

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
    setLoadingMessage("Please wait while we log you in");
    setCurrentTip(getRandomTip());

    await signInWithEmailAndPassword(auth, formdata.email, formdata.password)
      .then((userCredential) => {
        toast.success("User logged in successfully", {
          position: "top-center",
        });
        console.log(userCredential.user);
        navigate("/");
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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600 text-center animate-pulse mb-4">
              {loadingMessage}
            </p>

            {loadStartTime && Date.now() - loadStartTime > 3000 && (
              <div className="bg-blue-50 p-4 rounded-lg w-full mt-4">
                <p className="text-sm text-blue-700 text-center transition-all duration-500">
                  {currentTip}
                </p>
              </div>
            )}

            {loadStartTime && Date.now() - loadStartTime > 8000 && (
              <p className="text-xs text-gray-500 mt-4 text-center">
                This is taking longer than usual. Please wait...
              </p>
            )}
          </div>
        </div>
      </div>
    );
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
        <p className="text-center mt-4">
          Not an User?{" "}
          <a className="text-blue-500 hover:underline" href="/registration">
            Register Here
          </a>
        </p>
        <div className="mt-4">
          <SignInwithGoogle
            setLoading={setLoading}
            setLoadingMessage={setLoadingMessage}
            setTip={setCurrentTip}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

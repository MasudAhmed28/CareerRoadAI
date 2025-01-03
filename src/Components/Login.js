import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SignInwithGoogle from "./SignInwithGoogle";
import { Loader2 } from "lucide-react";
import { getRandomTip } from "./Util";
import logo from "./Images/logo.png";
import ForgotPassword from "./ForgotPassword";

const Login = () => {
  const [formdata, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [currentTip, setCurrentTip] = useState("");
  const [loadStartTime, setLoadStartTime] = useState(null);
  const [forgetPass, setForgetPass] = useState(false);
  const navigate = useNavigate();

  // ... [keeping all your existing useEffect and handler functions]
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
  const handleForgetPassword = async () => {
    console.log(forgetPass);
    setForgetPass(true);
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
    <div className="min-h-screen flex">
      {/* Left Section - Logo and Welcome Text */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-50 flex-col justify-center px-12">
        <div className="mb-8">
          <div className="w-40 h-14 rounded flex items-center justify-center">
            <img
              onClick={() => navigate("/")}
              src={logo}
              alt="logo"
              className="cursor-pointer"
            />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome Back</h1>
        <div className="space-y-6">
          <p className="text-lg text-gray-600">
            Experience seamless collaboration,enhanced productivity,personalized
            growth and streamlined learning with our AI-powered app.
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-0.5 bg-blue-500"></div>
              <span className="text-gray-700">
                Build your roadmap based on your unique answers
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-0.5 bg-blue-500"></div>
              <span className="text-gray-700">
                Access videos and read essential topics, tailored by AI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-0.5 bg-blue-500"></div>
              <span className="text-gray-700">
                Track your progress with AI-driven insights
              </span>
            </div>
          </div>

          <div className="mt-12 flex space-x-3">
            <div className="w-12 h-1.5 bg-blue-500 rounded-full"></div>
            <div className="w-3 h-1.5 bg-blue-300 rounded-full"></div>
            <div className="w-3 h-1.5 bg-blue-200 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      {forgetPass ? (
        <ForgotPassword />
      ) : (
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="flex justify-center mb-8 lg:hidden">
              <img
                onClick={() => navigate("/")}
                src={logo}
                alt="logo"
                className="w-32 cursor-pointer"
              />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-8">Sign In</h2>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formdata.email}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formdata.password}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 text-gray-600">
                    Remember me
                  </label>
                </div>
                <div
                  className="text-blue-500 hover:text-blue-600 cursor-pointer"
                  onClick={() => handleForgetPassword()}
                >
                  Forgot password?
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 font-medium"
              >
                Sign In
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <SignInwithGoogle
                  setLoading={setLoading}
                  setLoadingMessage={setLoadingMessage}
                  setTip={setCurrentTip}
                />
              </div>
            </div>

            <p className="text-center mt-8 text-sm text-gray-600">
              Not an User?{" "}
              <a
                className="text-blue-500 hover:text-blue-600 font-medium"
                href="/registration"
              >
                Register Here
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

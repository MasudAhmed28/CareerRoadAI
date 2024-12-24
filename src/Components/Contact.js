import React, { useState } from "react";
import MainFooter from "./MainFooter";
import MainHeader from "./MainHeader";
import axios from "axios";
import { backendUrl } from "../BackendUrl";
import { toast, ToastContainer } from "react-toastify";

const ContactPage = () => {
  const [formdata, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customMessage, setCustomMessage] = useState("Send Message");

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCustomMessage("Sending...");

    if (formdata.name && formdata.email && formdata.message) {
      try {
        const response = await axios.post(`${backendUrl}/createCase`, {
          formdata,
        });

        if (response.status === 200) {
          setCustomMessage("Message Sent ✔");
          setFormData({ name: "", email: "", message: "" });
          toast.success("Message sent successfully!");
        } else {
          setCustomMessage("Error Occurred");
          toast.error("Failed to send the message. Try again.");
        }
      } catch (error) {
        setCustomMessage("Error Occurred");
        toast.error("Internal Server Error");
      } finally {
        setTimeout(() => {
          setCustomMessage("Send Message");
          setIsSubmitting(false);
        }, 3000); // Reset after 3 seconds
      }
    } else {
      setCustomMessage("Incomplete Form");
      setIsSubmitting(false);
      toast.warn("Please fill out all fields.");
    }
  };

  return (
    <>
      <MainHeader />
      <ToastContainer />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Contact CareerRoadAI
            </h1>

            <form className="space-y-4" onSubmit={handleFormSubmit}>
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formdata.name}
                  onChange={handleFormDataChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Name"
                  disabled={isSubmitting}
                />
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formdata.email}
                  onChange={handleFormDataChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your.email@example.com"
                  disabled={isSubmitting}
                />
              </div>

              {/* Message Input */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  name="message"
                  value={formdata.message}
                  onChange={handleFormDataChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your message..."
                  disabled={isSubmitting}
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${
                  customMessage === "Message Sent ✔"
                    ? "bg-green-600"
                    : customMessage === "Error Occurred"
                    ? "bg-red-600"
                    : "bg-blue-600"
                } text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-all duration-300`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  customMessage
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <MainFooter />
    </>
  );
};

export default ContactPage;

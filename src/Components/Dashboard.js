import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "./Contexts/DataContext";
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";
import { User, ListChecks, LogOut, Activity } from "lucide-react";
import LoadSpinner from "./LoadSpinner";

const Dashboard = () => {
  const { user, logout } = useContext(DataContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center space-x-4">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-500" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {user?.displayName || "User"}
                </h2>
                 <p className="text-gray-600 text-[0.7rem]">{user?.email}</p>
              </div>
            </div>
          </div>
        );
      case "tasks":
        return (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ListChecks className="mr-2 text-blue-500" /> My Tasks
            </h2>
            <p>No tasks available</p>
          </div>
        );
      case "activity":
        return (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Activity className="mr-2 text-green-500" /> Recent Activity
            </h2>
            <p>No recent activity</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return <LoadSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <MainHeader />
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="bg-white shadow-md rounded-lg p-4 h-fit">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left p-2 rounded flex items-center ${
                  activeTab === "profile"
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <User className="mr-2" /> Profile
              </button>
              <button
                onClick={() => setActiveTab("tasks")}
                className={`w-full text-left p-2 rounded flex items-center ${
                  activeTab === "tasks"
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <ListChecks className="mr-2" /> Tasks
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`w-full text-left p-2 rounded flex items-center ${
                  activeTab === "activity"
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <Activity className="mr-2" /> Activity
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            {renderContent()}

            <div className="mt-6 bg-white shadow-md rounded-lg p-6 flex justify-between items-center">
              <p className="text-gray-600">Want to leave the application?</p>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
              >
                <LogOut className="mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  );
};

export default Dashboard;

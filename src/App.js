import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Registration from "./Components/Registration";

import Dashboard from "./Components/Dashboard";
import HomePage from "./Components/Home";

import ChatGptBot from "./Components/ChatGptBot";
import { ToastContainer } from "react-toastify";
import { DataProvider } from "./Components/Contexts/DataContext";
import Roadmap from "./Components/Roadmap";
import DetailPage from "./Components/DetailPage";
import TermsCondition from "./Components/TermsCondition";

import ContactPage from "./Components/Contact";
import Course from "./Components/Course";
import About from "./Components/About";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import ProtectedRoute from "./Components/Contexts/ProtectedRoute";

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/ai" element={<ChatGptBot />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route
            path="/roadmap/detailPage/:topicId/:subtopicid/:subtopicStatus/:name"
            element={<DetailPage />}
          />
          <Route path="/terms&condition" element={<TermsCondition />} />
          <Route
            path="/course/:topicId"
            element={
              <ProtectedRoute>
                <Course />
              </ProtectedRoute>
            }
          />
          <Route path="/contactCareerRoadAITeam" element={<ContactPage />} />
          <Route path="/About-us" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
        <ToastContainer autoClose={1000} />
      </BrowserRouter>
    </DataProvider>
  );
}

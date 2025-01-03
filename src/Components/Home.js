import React, { useState } from "react";
import { BookOpen, Code, Users, ArrowRight } from "lucide-react";

import ChatGptBot from "./ChatGptBot";

import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [isChatVisible, setChatVisible] = useState(false);
  const navigate = useNavigate();

  const toggleChat = () => {
    setChatVisible(!isChatVisible);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <MainHeader />
      <main className="container mx-auto mt-8 px-4">
        <section className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
            Master Any Skills for Free with AI
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Let CareerRoadAI create a curated Roadmap for you.
          </p>
          <button
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:from-indigo-700 hover:to-purple-700 transform transition hover:-translate-y-0.5 shadow-lg hover:shadow-indigo-200"
            onClick={toggleChat}
          >
            Get Started <ArrowRight className="inline ml-2" />
          </button>
        </section>
        <ChatGptBot isVisible={isChatVisible} onClose={toggleChat} />
        <section className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: BookOpen,
              title: "Comprehensive Courses",
              content:
                "From machine learning basics to deep neural networks, we've got you covered.",
            },
            {
              icon: Code,
              title: "Hands-on Projects",
              content:
                "Apply your knowledge with real-world AI projects and coding exercises.",
            },
            {
              icon: Users,
              title: "Community Support",
              content:
                "Join a community of learners and AI enthusiasts to grow together.",
            },
          ].map((feature, index) => (
           <div
              {...(feature.title === "Community Support"
                ? { onClick: () => navigate("/community") }
                : {})}
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-xl cursor-pointer shadow-lg p-6 hover:shadow-xl transition border border-purple-100 group hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold mb-2 flex items-center text-indigo-600">
                <feature.icon className="mr-2 text-blue-600" size={24} />
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.content}</p>
            </div>
          ))}
        </section>

        <section className="text-center mb-12 bg-blue-100 py-12 rounded-lg shadow-inner">
          <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
            Ready to dive into AI?
          </h3>
          <button
            onClick={() => navigate("/course/ai")}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:from-indigo-700 hover:to-purple-700 transform transition hover:-translate-y-0.5 shadow-lg hover:shadow-indigo-200"
          >
            Browse Courses
          </button>
        </section>
      </main>
      <MainFooter />
    </div>
  );
};

export default HomePage;

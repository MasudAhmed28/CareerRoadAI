import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "./Contexts/DataContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, Check, Clock, XCircle } from "lucide-react";
import { backendUrl } from "../BackendUrl";
import axios from "axios";
import { toast } from "react-toastify";
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";
import { ArrowRight } from "lucide-react";
import ChatGptBot from "./ChatGptBot";

const Roadmap = () => {
  const [isChatVisible, setChatVisible] = useState(false);
  const { fetchRoadMap, roadmapData, user, loading, idToken } =
    useContext(DataContext);
  const navigate = useNavigate();
  const [expandedTopics, setExpandedTopics] = useState({});
  const location = useLocation();
  useEffect(() => {
    if (user) {
      fetchRoadMap(user, idToken);
    }
  }, [location, user]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const toggleChat = () => {
    setChatVisible(!isChatVisible);
  };

  if (roadmapData === null) {
    return (
      <>
        <MainHeader />
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <p>No roadmap data available.</p>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-lg"
            onClick={toggleChat}
          >
            Get Started <ArrowRight className="inline ml-2" />
          </button>
        </div>
        <ChatGptBot isVisible={isChatVisible} onClose={toggleChat} />
        <MainFooter />
      </>
    );
  }

  if (!roadmapData || !roadmapData.topics) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleClick = async (topicId, name, subtopicid, subtopicStatus) => {
    try {
      if (subtopicStatus === "not started") {
        const uid = user?.uid;
        if (!uid) {
          throw new Error("User not found");
        }
        const response = await axios.post(`${backendUrl}/updateStatus`, {
          topicId,
          subtopicid,
          uid,
        });
        if (response.status !== 200) {
          throw new Error(
            `Failed to update status. Server responded with status ${response.status}`
          );
        }
      }

      navigate(
        `detailPage/${encodeURIComponent(topicId)}/${encodeURIComponent(
          subtopicid
        )}/${encodeURIComponent(subtopicStatus)}/${encodeURIComponent(name)}`
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          "OOOpppss , Can you please try again after some time?";
        toast.error(errorMessage, { position: "top-center" });
      } else {
        toast.error(error.message, { position: "top-center" });
      }
    }
  };

  const toggleTopic = (topicId) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const StatusIndicator = ({ status }) => {
    const statusConfig = {
      completed: {
        icon: <Check size={16} />,
        bg: "bg-green-500",
        text: "Completed",
      },
      "in progress": {
        icon: <Clock size={16} />,
        bg: "bg-yellow-500",
        text: "In Progress",
      },
      "not started": {
        icon: <XCircle size={16} />,
        bg: "bg-red-500",
        text: "Not Started",
      },
    };

    const config = statusConfig[status?.toLowerCase()] || {
      icon: <Clock size={16} />,
      bg: "bg-gray-500",
      text: "No Status",
    };

    return (
      <div
        className={`flex items-center gap-1 ${config.bg} text-white text-xs px-2 py-1 rounded-full`}
      >
        {config.icon}
        <span>{config.text}</span>
      </div>
    );
  };

  // Progress calculation
  const calculateProgress = (topic) => {
    const completedSubtopics = topic.subtopics.filter(
      (sub) => sub.status?.toLowerCase() === "completed"
    ).length;
    return (completedSubtopics / topic.subtopics.length) * 100;
  };

  return (
    <>
      <MainHeader />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Learning Roadmap
        </h1>

        <div className="space-y-4">
          {roadmapData.topics.map((topic) => (
            <div
              key={topic._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
            >
              {/* Topic Header */}
              <div
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleTopic(topic._id)}
              >
                <div className="flex items-center gap-4 flex-1">
                  {expandedTopics[topic._id] ? (
                    <ChevronDown className="text-gray-500" size={20} />
                  ) : (
                    <ChevronRight className="text-gray-500" size={20} />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3
                        className="font-semibold text-lg text-gray-800 hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          //handleClick(topic.name);
                        }}
                      >
                        {topic.name}
                      </h3>
                      <StatusIndicator status={topic.status} />
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${calculateProgress(topic)}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Progress: {Math.round(calculateProgress(topic))}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtopics */}
              {expandedTopics[topic._id] && (
                <div className="border-t border-gray-100">
                  <ul className="divide-y divide-gray-100">
                    {topic.subtopics.map((subtopic) => (
                      <li
                        key={subtopic._id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className="flex-1 cursor-pointer hover:text-blue-600"
                            onClick={() =>
                              handleClick(
                                topic._id,
                                subtopic.name,
                                subtopic._id,
                                subtopic.status
                              )
                            }
                          >
                            {subtopic.name}
                          </div>
                          <StatusIndicator status={subtopic.status} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <MainFooter />
    </>
  );
};

export default Roadmap;

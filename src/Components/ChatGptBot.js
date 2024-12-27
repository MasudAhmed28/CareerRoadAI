import React, { useContext, useEffect, useRef, useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { X } from "lucide-react";

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

import { useNavigate } from "react-router-dom";

import { backendUrl } from "../BackendUrl";
import { toast } from "react-toastify";

import { DataContext } from "./Contexts/DataContext";

const API_KEY = process.env.REACT_APP_CHATGPT_API_KEY;

const ChatGptBot = ({ isVisible, onClose }) => {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);

  const { roadmapData, user } = useContext(DataContext);

  useEffect(() => {
    if (user) {
      const uname = user.displayName;
      setMessages([
        {
          message: `Hi ${uname}, Please tell me the job you are looking to target?`,
          sender: "ChatGPT",
          direction: "incoming",
        },
      ]);
    }
  }, [user]);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const scrollableElement = chatContainerRef.current.querySelector(
        ".cs-message__html-content"
      );
      if (scrollableElement) {
        scrollableElement.scrollTop = scrollableElement.scrollHeight;
      }
    }
  };

  const navigate = useNavigate();

  const handleSend = async (message) => {
    if (roadmapData) return;
    const newMessage = {
      message,
      sender: "user",
      direction: "outgoing",
    };
    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });
    const systemMessage = {
      role: "system",
      content: `You are a career counsellor providing accurate roadmaps to help users upskill in relevant areas for their target jobs. Generate a personalized career roadmap only if you have sufficient detailed information about the user's specific field, subfield, domain, subdomain, technologies, tech stack, programming languages (if applicable), experience level, and career goals. Output the roadmap in the following JSON format: it must start with 'const roadmapData =' and end immediately after the JSON data without any additional text, greetings, or explanations. Each topic must include an id, name, and an array of subtopics (which also have their own id and name).The roadmap response should start with "const roadmapdata=" and no greeting or sentences should be present before and after the roadmapdata For example:
const roadmapData = {
  name: "Roadmap to Becoming a Salesforce Developer",
  topics: [
    {
      id: "1",
      name: "Understand the Salesforce Ecosystem",
      subtopics: [
        { id: "1.1", name: "Salesforce Overview" }
      ]
    },
    {
      id: "2",
      name: "Get Familiar with Salesforce Platform Basics",
      subtopics: [
        { id: "2.1", name: "Salesforce Trailhead" },
        { id: "2.2", name: "Salesforce Terminology" }
      ]
    }
    // Continue for other topics
  ]
}; 
If you require more information, ask a specific follow-up question to gather relevant details, ensuring questions are one at a time and very specific. The first input from the user will be their target job.`,
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        const replyMessage = data.choices[0].message.content;

        if (replyMessage.includes("roadmapData")) {
          setMessages([
            ...chatMessages,
            {
              message:
                "Thank you! Your Roadmap is created,Please check the Roadmap tab  ",
              sender: "ChatGPT",
              direction: "incoming",
            },
          ]);

          let roadmapString = replyMessage;

          roadmapString = roadmapString
            .replace("const roadmapData =", "")
            .trim();

          const lastCurlyBraceIndex = roadmapString.lastIndexOf("}");
          if (lastCurlyBraceIndex !== -1) {
            roadmapString = roadmapString.substring(0, lastCurlyBraceIndex + 1);
          }

          roadmapString = roadmapString
            .replace(/(\w+):/g, '"$1":')
            .replace(/'/g, '"');

          try {
            const rdata = JSON.parse(roadmapString);
            const roadmapName = rdata.name;
            const roadmapTopics = rdata.topics;

            saveRoadmap(roadmapName, roadmapTopics);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        } else {
          setMessages([
            ...chatMessages,
            {
              message: replyMessage,
              sender: "ChatGPT",
              direction: "incoming",
            },
          ]);
        }

        setTyping(false);
      });
  }

  async function saveRoadmap(rname, rtopics) {
    try {
      const response = await fetch(`${backendUrl}/saveRoadmap`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: rname,
          topics: rtopics,
          userId: user.uid,
        }),
      });
      if (response.status === 200) {
        toast.success("Roadmap Saved successfully", {
          position: "top-center",
          autoClose: 5000,
        });
        navigate("/roadmap");
      }
    } catch (error) {
      console.log(error);
    }
  }
  const messageEndRef = useRef(null);
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!isVisible) return null;

  return (
    <div className="z-10 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col"
        style={{ height: "80vh" }}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">CareerRoadAI Career Advisor</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-hidden" ref={chatContainerRef}>
          {user ? (
            !roadmapData ? (
              <MainContainer style={{ height: "100%" }}>
                <ChatContainer style={{ height: "100%" }}>
                  <MessageList
                    scrollBehavior="smooth"
                    typingIndicator={
                      typing ? (
                        <TypingIndicator content="EduFlexAI is typing" />
                      ) : null
                    }
                  >
                    {messages.map((message, i) => {
                      return <Message key={i} model={message} />;
                    })}
                  </MessageList>
                </ChatContainer>
              </MainContainer>
            ) : (
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 flex flex-col justify-center items-center">
                <h1 className="text-lg font-semibold text-center">
                  Roadmap already exist
                </h1>
                <button
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:from-indigo-700 hover:to-purple-700 transform transition hover:-translate-y-0.5 shadow-lg hover:shadow-indigo-200"
                  onClick={() => navigate("/roadmap")}
                >
                  Click Here
                </button>
              </div>
            )
          ) : (
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 flex flex-col justify-center items-center">
              <h2 className="text-lg font-semibold text-center">
                Please Login to use this AI feature
              </h2>
              <button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:from-indigo-700 hover:to-purple-700 transform transition hover:-translate-y-0.5 shadow-lg hover:shadow-indigo-200"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
          )}
        </div>
        {user && !roadmapData && (
          <div className="p-4 border-t">
            <MessageInput
              placeholder="Type message here"
              onSend={handleSend}
              attachButton={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatGptBot;

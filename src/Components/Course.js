import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "./Contexts/DataContext";
import axios from "axios";
import { toast } from "react-toastify";
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";
import LoadSpinner from "./LoadSpinner";
import { useParams } from "react-router-dom";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const { loading, roadmapData } = useContext(DataContext);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const { topicId } = useParams();

  useEffect(() => {
    if (roadmapData?.name) {
      const selectedTopic =
        topicId.toLowerCase() === "ai" ? "AI" : roadmapData.name;
      setTopic(selectedTopic);

      fetchCoursesOnline(selectedTopic);
    } else {
      setTopic("");
    }
  }, [roadmapData, topicId]);

  const fetchCoursesOnline = async (topic) => {
    setLoading(true);
    if (!topic) return;
    const isAICourse = topic.toLowerCase() === "ai";
    const cacheKey = isAICourse ? "AICourses" : "Courses";
    const cacheExpiryKey = `${cacheKey}-expiry`;

    try {
      const cachedData = localStorage.getItem(cacheKey);

      const cacheExpiration = localStorage.getItem(cacheExpiryKey);

      if (cachedData && Date.now() < cacheExpiration) {
        const parsedData = JSON.parse(cachedData);
        setCourses(parsedData);

        return;
      }

      const response = await axios.get(
        `https://www.googleapis.com/customsearch/v1`,
        {
          params: {
            q: `free ${topic} courses`,
            key: process.env.REACT_APP_YOUTUBE_API_KEY,
            cx: process.env.REACT_APP_GOOGLE_CX,
          },
        }
      );

      const result = response.data?.items?.map((item) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
      }));
      localStorage.setItem(cacheKey, JSON.stringify(result));
      localStorage.setItem(cacheExpiryKey, Date.now() + 3600 * 1000);
      setCourses(result);
    } catch (error) {
      console.log(error);
      toast.error(error.Message, { position: "top-center" });
    }finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <LoadSpinner text={"Loading Course"} />;
  }

  return (
    <>
      <MainHeader />

      <div className="p-5 pt-20 pb-30">
        <h2 className="text-center mb-8 font-semibold text-3xl">
          {topic ? `Courses Related to ${topic}` : "No topic/Courses found"}
        </h2>
        {courses?.length > 0 ? (
          <div className="flex flex-wrap gap-5 justify-center">
            {courses?.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg shadow-md p-4 max-w-xs w-full text-center transition-transform transform hover:scale-105 hover:shadow-lg"
              >
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {item.title}
                  </h3>
                </a>
                <p className="text-sm text-gray-600">{item.snippet}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-base">
            {topic ? "No courses available for the selected topic" : ""}
          </p>
        )}
      </div>
      <MainFooter />
    </>
  );
};

export default Course;

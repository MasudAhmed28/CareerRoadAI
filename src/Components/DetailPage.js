import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { backendUrl } from "../BackendUrl";
import { DataContext } from "./Contexts/DataContext";
import MainFooter from "./MainFooter";
import MainHeader from "./MainHeader";
import LoadSpinner from "./LoadSpinner";

const DetailPage = () => {
  const { user, fetchRoadMap, roadmapData } = useContext(DataContext);
  const location = useLocation();
  const { name, topicId, subtopicid, subtopicStatus } = useParams();

  const [complete, setComplete] = useState(
    subtopicStatus === "completed" ? "Completed" : "Mark as Complete"
  );
  const [refreshedStatus, setRefreshedStatus] = useState(subtopicStatus);
  const [videoUrl, setVideoUrl] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndUpdateStatus = async () => {
      try {
        await fetchRoadMap();
        const refreshedTopic = roadmapData?.topics?.find(
          (t) => t._id === topicId
        );
        const refreshedSubtopic = refreshedTopic?.subtopics?.find(
          (s) => s._id === subtopicid
        );
        const status = refreshedSubtopic?.status;

        setRefreshedStatus(status || subtopicStatus);
        if (status === "completed") setComplete("Completed");
      } catch (err) {
        console.error("Failed to fetch roadmap:", err);
      }
    };

    fetchAndUpdateStatus();
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const videoResult = await fetchVideoContent(name);
        setVideoUrl(videoResult);

        const wikiResult = await fetchWikiContent(name);
        setContent(wikiResult);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [name]);

  const handleStatus = async () => {
    if (refreshedStatus !== "completed") {
      try {
        const uid = user.uid;
        const response = await axios.post(`${backendUrl}/markComplete`, {
          uid,
          topicId,
          subtopicid,
        });

        if (response.status === 200 || response.status === 201) {
          setRefreshedStatus("completed");
          setComplete("Completed");
        }
      } catch (error) {
        console.error("Failed to mark complete:", error);
        alert("Failed to mark topic as complete. Please try again.");
      }
    }
  };

  const fetchVideoContent = async (topic) => {
    try {
      const youtubeVideo = await fetchYouTubeVideo(topic);
      if (youtubeVideo) return youtubeVideo;

      const pexelsVideo = await fetchPexelsVideo(topic);
      if (pexelsVideo) return pexelsVideo;

      return null;
    } catch (error) {
      console.error("Video fetch error:", error);
      return null;
    }
  };

  const fetchYouTubeVideo = async (topic) => {
    try {
      const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY || "";
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${topic}&type=video&videoLicense=creativeCommon&key=${apiKey}&maxResults=1`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        return `https://www.youtube.com/embed/${data.items[0].id.videoId}`;
      }
      return null;
    } catch (error) {
      console.error("YouTube fetch error:", error);
      return null;
    }
  };

  const fetchPexelsVideo = async (topic) => {
    try {
      const apiKey = "YOUR_PEXELS_API_KEY";
      const response = await fetch(
        `https://api.pexels.com/videos/search?query=${topic}&per_page=1`,
        { headers: { Authorization: apiKey } }
      );
      const data = await response.json();

      if (data.videos && data.videos.length > 0) {
        return data.videos[0].video_files[0].link;
      }
      return null;
    } catch (error) {
      console.error("Pexels fetch error:", error);
      return null;
    }
  };

  const fetchWikiContent = async (topic) => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          topic
        )}`
      );
      const data = await response.json();

      return data.extract || "No content available for this topic.";
    } catch (error) {
      console.error("Wiki fetch error:", error);
      return "Unable to retrieve topic information.";
    }
  };

  if (isLoading) {
    return <LoadSpinner text={"Loading topic details"} />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
            <button
              onClick={handleStatus}
              disabled={refreshedStatus === "completed"}
              className={`px-4 py-2 rounded transition duration-300 ${
                refreshedStatus === "completed"
                  ? "bg-green-500 text-white cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {complete}
            </button>
          </div>

          <div className="mb-6 bg-gray-100 rounded-lg overflow-hidden shadow-md">
            {videoUrl ? (
              <iframe
                className="w-full h-96 object-cover"
                src={videoUrl}
                title={`${name} Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="p-6 text-center bg-gray-200">
                <p className="text-gray-600">
                  No video available for this topic
                </p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              About the Topic
            </h2>
            <p className="text-gray-700 leading-relaxed">{content}</p>
          </div>
        </div>
      </div>
      <MainFooter />
    </>
  );
};

export default DetailPage;

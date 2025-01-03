import React, { useState, useEffect, useContext } from "react";
import { backendUrl } from "../BackendUrl";
import { DataContext } from "./Contexts/DataContext";
import { ThumbsUp, MessageCircle, Loader2, ChevronDown } from "lucide-react";
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";

const QuestionDetail = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(DataContext);
  const [qliked, setQliked] = useState(false);
  const [ansliked, setAnsliked] = useState(false);

  // Keeping all the existing fetch and handle functions the same
  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/questions?page=${page}&limit=5`
      );
      const data = await response.json();
      if (data.length < 5) setHasMore(false);
      setQuestions((prev) => (page === 1 ? data : [...prev, ...data]));
      setLoading(false);
    } catch (error) {
      setError("Failed to load questions");
      setLoading(false);
    }
  };

  const fetchReplies = async (questionId) => {
    try {
      const response = await fetch(
        `${backendUrl}/questions/${questionId}/replies`
      );
      const data = await response.json();
      setReplies((prev) => ({ ...prev, [questionId]: data }));
    } catch (error) {
      setError("Failed to load replies");
    }
  };

  const handleUpvote = async (questionId) => {
    try {
      const action = qliked ? "dec" : "inc";
      const response = await fetch(
        `${backendUrl}/question/${questionId}/upvote`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upvote");
      }

      setQuestions(
        questions.map((q) =>
          q._id === questionId
            ? { ...q, upvotes: q.upvotes + (qliked ? -1 : 1) }
            : q
        )
      );
      setQliked(!qliked);
    } catch (error) {
      console.error(error);
      setError("Failed to update upvote status. Please try again.");
    }
  };

  const handleUpvoteReplies = async (replyId) => {
    try {
      const action = ansliked ? "dec" : "inc";
      const response = await fetch(`${backendUrl}/replies/${replyId}/upvote`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) {
        throw new Error("Failed to upvote");
      }
      setReplies((prevReplies) => {
        const updatedReplies = { ...prevReplies };
        for (const questionId in updatedReplies) {
          if (updatedReplies[questionId]) {
            updatedReplies[questionId] = updatedReplies[questionId].map(
              (reply) =>
                reply._id === replyId
                  ? {
                      ...reply,
                      upvotes: reply.upvotes + (action === "inc" ? 1 : -1),
                    }
                  : reply
            );
          }
        }
        return updatedReplies;
      });
      setAnsliked(!ansliked);
    } catch (error) {
      console.log(error);
      setError("Failed to upvote");
    }
  };

  const handleQuestionSubmit = async () => {
    if (!newQuestion.trim()) return;
    try {
      const response = await fetch(`${backendUrl}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: newQuestion.trim(),
          userId: user.uid,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setQuestions((prev) => [data, ...prev]);
        setNewQuestion("");
      } else {
        setError("Failed to submit question");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to submit question");
    }
  };

  const handleReplySubmit = async (questionId) => {
    if (!newReply.trim()) return;
    try {
      const response = await fetch(
        `${backendUrl}/questions/${questionId}/replies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body: newReply.trim(), userId: user.uid }),
        }
      );
      const data = await response.json();
      setReplies((prev) => ({
        ...prev,
        [questionId]: [data, ...(prev[questionId] || [])],
      }));
      setNewReply("");
      setQuestions(
        questions.map((q) =>
          q._id === questionId
            ? { ...q, replyCount: (q.replyCount || 0) + 1 }
            : q
        )
      );
    } catch (error) {
      setError("Failed to submit reply");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [page]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );

  if (error)
    return (
      <div className="p-4 text-red-500 text-center font-medium">{error}</div>
    );

  return (
    <>
      <MainHeader />
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            Community Discussion
          </h1>
          <div className="mb-6">
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Start a discussion..."
              className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24 outline-none transition duration-200"
            />
            <button
              onClick={handleQuestionSubmit}
              className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 font-medium"
            >
              Post Discussion
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={question.userInfo.photo}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {question.userInfo.name}
                    </h3>
                    <p className="mt-2 text-gray-700 leading-relaxed">
                      {question.body}
                    </p>

                    <div className="flex items-center space-x-6 mt-4">
                      <button
                        onClick={() => handleUpvote(question._id)}
                        className={`flex items-center space-x-2  hover:text-blue-500 transition duration-200 ${
                          qliked ? "text-blue-500" : "text-gray-500"
                        }`}
                      >
                        <ThumbsUp className="w-5 h-5" />
                        <span className="font-medium">
                          {question.upvotes || 0}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedQuestion(
                            question._id === selectedQuestion
                              ? null
                              : question._id
                          );
                          if (question._id !== selectedQuestion) {
                            fetchReplies(question._id);
                          }
                        }}
                        className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition duration-200"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-medium">
                          {question.replyCount || 0}
                        </span>
                      </button>
                    </div>

                    {selectedQuestion === question._id && (
                      <div className="mt-6 space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <textarea
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            placeholder="Write your reply..."
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-20 outline-none transition duration-200"
                          />
                          <button
                            onClick={() => handleReplySubmit(question._id)}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 font-medium"
                          >
                            Reply
                          </button>
                        </div>

                        <div className="space-y-4">
                          {replies[question._id]?.map((reply) => (
                            <div
                              key={reply._id}
                              className="bg-gray-50 p-4 rounded-lg"
                            >
                              <div className="flex items-start space-x-3">
                                <img
                                  src={reply?.userInfo?.photo}
                                  alt="Profile"
                                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-100"
                                />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900">
                                    {reply.userInfo.name}
                                  </h4>
                                  <p className="mt-1 text-gray-700 leading-relaxed">
                                    {reply.body}
                                  </p>
                                  <div className="flex items-center justify-between mt-3">
                                    <button
                                      onClick={() =>
                                        handleUpvoteReplies(reply._id)
                                      }
                                      className={`flex items-center space-x-2  hover:text-blue-500 transition duration-200 ${
                                        ansliked
                                          ? "text-blue-500"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      <ThumbsUp className="w-4 h-4" />
                                      <span className="font-medium">
                                        {reply.upvotes || 0}
                                      </span>
                                    </button>
                                    <small className="text-gray-500">
                                      {new Date(
                                        reply.timestamp
                                      ).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="w-full py-3 flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-500 transition duration-200 bg-white rounded-lg shadow-md"
          >
            <span className="font-medium">Load More</span>
            <ChevronDown className="w-5 h-5" />
          </button>
        )}
      </div>
      <MainFooter />
    </>
  );
};

export default QuestionDetail;

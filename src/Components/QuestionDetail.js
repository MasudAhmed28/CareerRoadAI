import React, { useState, useEffect, useContext } from "react";
import { backendUrl } from "../BackendUrl";
import { DataContext } from "./Contexts/DataContext";
import { ThumbsUp, MessageCircle, Loader2 } from "lucide-react";
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";

const QuestionDetail = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [replies, setReplies] = useState({});
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [replyLoading, setReplyLoading] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const [replyPages, setReplyPages] = useState({});
  const { user } = useContext(DataContext);
  const REPLIES_PER_PAGE = 5;

  const fetchQuestions = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${backendUrl}/questions?page=${page}&limit=5&userId=${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch questions");
      const data = await response.json();
      if (data.length < 5) setHasMore(false);
      setQuestions((prev) => (page === 1 ? data : [...prev, ...data]));
    } catch (error) {
      setError("Failed to load questions.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (questionId, replyPage = 1) => {
    try {
      setReplyLoading((prev) => ({ ...prev, [questionId]: true }));
      const response = await fetch(
        `${backendUrl}/questions/${questionId}/replies?page=${replyPage}&limit=${REPLIES_PER_PAGE}`
      );
      if (!response.ok) throw new Error("Failed to fetch replies");
      const data = await response.json();

      setReplies((prev) => ({
        ...prev,
        [questionId]:
          replyPage === 1 ? data : [...(prev[questionId] || []), ...data],
      }));

      return data.length === REPLIES_PER_PAGE;
    } catch (error) {
      setError("Failed to load replies.");
      console.error(error);
    } finally {
      setReplyLoading((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const handleUpvote = async (questionId) => {
    if (!user) return setError("Please login to vote");

    try {
      const question = questions.find((q) => q._id === questionId);
      const action = question.likedBy.includes(user?.uid) ? "dec" : "inc"; // Toggle vote
      const response = await fetch(
        `${backendUrl}/question/${questionId}/upvote`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, userId: user.uid }),
        }
      );

      if (!response.ok) throw new Error("Failed to update vote");

      setQuestions((prev) =>
        prev.map((q) =>
          q._id === questionId
            ? {
                ...q,
                upvotes: q.upvotes + (action === "inc" ? 1 : -1),
                likedBy:
                  action === "inc"
                    ? [...q.likedBy, user.uid]
                    : q.likedBy.filter((id) => id !== user.uid),
              }
            : q
        )
      );
    } catch (error) {
      setError("Failed to update vote.");
      console.error(error);
    }
  };

  const handleUpvoteReplies = async (replyId) => {
    if (!user) return setError("Please login to vote");

    try {
      // Find the reply object by replyId across all questions
      let targetReply = null;
      let targetQuestionId = null;
      for (const questionId in replies) {
        targetReply = replies[questionId].find((r) => r._id === replyId);
        if (targetReply) {
          targetQuestionId = questionId;
          break;
        }
      }

      if (!targetReply) {
        throw new Error("Reply not found");
      }

      // Toggle upvote status
      const action = targetReply.likedBy.includes(user?.uid) ? "dec" : "inc"; // Toggle vote
      const response = await fetch(`${backendUrl}/replies/${replyId}/upvote`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, userId: user.uid }),
      });

      if (!response.ok) throw new Error("Failed to update reply vote");

      // Update replies in state
      setReplies((prevReplies) => {
        const updatedReplies = { ...prevReplies };
        updatedReplies[targetQuestionId] = updatedReplies[targetQuestionId].map(
          (reply) =>
            reply._id === replyId
              ? {
                  ...reply,
                  upvotes: reply.upvotes + (action === "inc" ? 1 : -1),
                  likedBy:
                    action === "inc"
                      ? [...reply.likedBy, user.uid]
                      : reply.likedBy.filter((id) => id !== user.uid),
                }
              : reply
        );
        return updatedReplies;
      });
    } catch (error) {
      setError("Failed to update reply vote.");
      console.error(error);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setError("Please login to post a question");
    if (!newQuestion.trim()) return;

    try {
      const response = await fetch(`${backendUrl}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: newQuestion.trim(),
          userId: user.uid,
          timeStamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to create question");

      const data = await response.json();
      setQuestions((prev) => [data, ...prev]);
      setNewQuestion("");
    } catch (error) {
      setError("Failed to submit question.");
      console.error(error);
    }
  };

  const handleReplySubmit = async (questionId, e) => {
    e.preventDefault();
    if (!user) return setError("Please login to reply");
    if (!newReply.trim()) return;

    try {
      const response = await fetch(
        `${backendUrl}/questions/${questionId}/replies`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            body: newReply.trim(),
            userId: user.uid,
            timeStamp: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create reply");

      const data = await response.json();
      setReplies((prev) => ({
        ...prev,
        [questionId]: [data, ...(prev[questionId] || [])],
      }));

      // Update question reply count
      setQuestions((prev) =>
        prev.map((q) =>
          q._id === questionId
            ? { ...q, replyCount: (q.replyCount || 0) + 1 }
            : q
        )
      );

      setNewReply("");
    } catch (error) {
      setError("Failed to submit reply.");
      console.error(error);
    }
  };

  const loadMoreReplies = async (questionId) => {
    const nextPage = (replyPages[questionId] || 1) + 1;
    const hasMoreReplies = await fetchReplies(questionId, nextPage);
    if (!hasMoreReplies) {
      setReplyPages((prev) => ({
        ...prev,
        [questionId]: -1, // Indicates no more replies
      }));
    }
  };

  useEffect(() => {
    fetchQuestions(user?.uid);
  }, [page]);

  function timeAgo(givenDate) {
    console.log(typeof givenDate);
    if (!givenDate) {
      return "Invalid date";
    }
    const givenDateObject = new Date(givenDate.trim());

    if (isNaN(givenDateObject.getTime())) {
      return "Invalid date";
    }

    const currentDate = new Date();
    const timeDifference = currentDate - givenDateObject;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    } else if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
  }

  const ErrorMessage = () =>
    error ? (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        {error}
        <button
          className="absolute top-0 right-0 px-4 py-3"
          onClick={() => setError("")}
        >
          ×
        </button>
      </div>
    ) : null;

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );

  return (
    <>
      <MainHeader />
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <ErrorMessage />

        {/* Question Form */}
        <form
          onSubmit={handleQuestionSubmit}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder={
              user ? "Start a discussion..." : "Please login to post a question"
            }
            className="w-full h-24 p-4 border rounded-lg resize-none"
            disabled={!user}
          />
          <button
            type="submit"
            disabled={!user || !newQuestion.trim()}
            className={`mt-4 p-2 rounded-lg ${
              user && newQuestion.trim()
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Post Discussion
          </button>
        </form>

        {/* Questions List */}
        {questions.map((question) => (
          <div
            key={question._id}
            className="bg-white rounded-xl p-6 shadow-lg mb-8 border-b-4 border-blue-200"
          >
            <div className="flex items-center space-x-4">
              <img
                src={question.userInfo.photo}
                alt={`${question.userInfo.name}'s profile`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{question.userInfo.name}</p>
                  <p className="text-sm text-gray-500">
                    {timeAgo(question?.timestamp)}
                  </p>
                </div>
                <p className="mt-2 text-gray-700">{question.body}</p>
              </div>
            </div>

            <div className="flex items-center mt-4 space-x-6">
              <button
                onClick={() => handleUpvote(question._id)}
                className={`flex items-center space-x-2 hover:text-blue-500 transition duration-200 ${
                  question.likedBy.includes(user?.uid)
                    ? "text-blue-500"
                    : "text-gray-500"
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
                <span>{question.upvotes}</span>
              </button>
              <button
                onClick={() => {
                  setSelectedQuestion((prev) =>
                    prev === question._id ? null : question._id
                  );
                  if (!replies[question._id]) {
                    fetchReplies(question._id);
                  }
                }}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{question.replyCount || 0}</span>
              </button>
            </div>

            {/* Replies Section */}
            {selectedQuestion === question._id && (
              <div className="mt-4 space-y-4 ml-4">
                {/* Reply Form */}
                <form
                  onSubmit={(e) => handleReplySubmit(question._id, e)}
                  className="flex items-center space-x-4"
                >
                  <textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder={
                      user
                        ? "Write a reply..."
                        : "Please login to write a reply"
                    }
                    className="w-full h-16 p-4 border rounded-lg resize-none"
                    disabled={!user}
                  />
                  <button
                    type="submit"
                    disabled={!user || !newReply.trim()}
                    className={`p-2 rounded-lg ${
                      user && newReply.trim()
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Reply
                  </button>
                </form>

                {/* Reply List */}
                {replies[question._id]?.map((reply) => (
                  <div
                    key={reply._id}
                    className="bg-gray-100 p-4 rounded-xl shadow-lg space-y-2"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={reply.userInfo.photo}
                        alt={`${reply.userInfo.name}'s profile`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{reply.userInfo.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(reply.timeStamp).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="mt-2 text-gray-700">{reply.body}</p>
                      </div>
                    </div>

                    <div className="flex items-center mt-4 space-x-6">
                      <button
                        onClick={() => handleUpvoteReplies(reply._id)}
                        className={`flex items-center space-x-2 hover:text-blue-500 transition duration-200 ${
                          reply.likedBy.includes(user?.uid)
                            ? "text-blue-500"
                            : "text-gray-500"
                        }`}
                      >
                        <ThumbsUp className="w-5 h-5" />
                        <span>{reply.upvotes}</span>
                      </button>
                    </div>
                  </div>
                ))}

                {replyPages[question._id] !== -1 && (
                  <div className="text-center">
                    <button
                      onClick={() => loadMoreReplies(question._id)}
                      className="text-blue-500 hover:text-blue-700"
                      disabled={replyLoading[question._id]}
                    >
                      {replyLoading[question._id] ? (
                        <Loader2 className="w-6 h-6 animate-spin inline" />
                      ) : (
                        "Load more replies"
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {hasMore && (
          <div className="text-center">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="text-blue-500 hover:text-blue-700"
            >
              Load More Questions
            </button>
          </div>
        )}
      </div>
      <MainFooter />
    </>
  );
};

export default QuestionDetail;

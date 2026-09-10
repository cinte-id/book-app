import { useState } from "react";
import { ArrowLeft, Star, CheckCircle } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

type SatisfactionSurveyData = {
  id: string;
  ticketId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

const SatisfactionSurvey = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const ticketId = searchParams.get("ticket") || "";

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    const existingSurveys: SatisfactionSurveyData[] = JSON.parse(
      localStorage.getItem("satisfactionSurveys") || "[]"
    );

    const newSurvey: SatisfactionSurveyData = {
      id: `SRV-${String(existingSurveys.length + 1).padStart(3, "0")}`,
      ticketId,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "satisfactionSurveys",
      JSON.stringify([...existingSurveys, newSurvey])
    );

    setError("");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center px-4">
          <div className="text-center w-full">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-5">
              <CheckCircle
                size={42}
                className="text-green-500"
              />
            </div>

            <h1 className="text-2xl font-bold text-gray-800">
              Thank You!
            </h1>

            <p className="text-gray-500 mt-2 leading-relaxed">
              Your feedback helps us improve our customer service.
            </p>

            <div className="space-y-3 mt-7">
              <Link
                to="/tickets"
                className="block bg-blue-500 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-600"
              >
                Back to My Tickets
              </Link>

              <Link
                to="/"
                className="block border border-gray-200 text-gray-700 px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <header className="px-4 py-5 border-b bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Support Feedback
              </h1>

              <p className="text-sm text-gray-500">
                Tell us about your experience
              </p>
            </div>
          </div>
        </header>

        <main className="px-4 py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full mx-auto flex items-center justify-center">
              <Star
                size={30}
                className="text-blue-500"
              />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mt-5">
              How was your support experience?
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Your feedback helps us provide better support.
            </p>

            {ticketId && (
              <p className="text-xs text-gray-400 mt-2">
                Ticket: {ticketId}
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="mt-8">
            <p className="text-sm font-semibold text-gray-700 text-center mb-4">
              Rate your experience
            </p>

            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setRating(value);
                    setError("");
                  }}
                  className="p-1 transition-transform hover:scale-110"
                  aria-label={`Rate ${value} stars`}
                >
                  <Star
                    size={36}
                    className={
                      value <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>

            <div className="flex justify-between px-6 mt-2 text-xs text-gray-400">
              <span>Very dissatisfied</span>
              <span>Very satisfied</span>
            </div>
          </div>

          {/* Comment */}
          <div className="mt-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional comments
              <span className="font-normal text-gray-400">
                {" "}
                (optional)
              </span>
            </label>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you think..."
              rows={5}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 mt-3">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            className="w-full mt-5 bg-blue-500 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Submit Feedback
          </button>
        </main>
      </div>
    </div>
  );
};

export default SatisfactionSurvey;
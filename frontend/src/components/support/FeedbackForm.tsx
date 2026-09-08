import { useState } from "react";
import { CheckCircle2, Star } from "lucide-react";

export default function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a satisfaction rating.");
      return;
    }

    if (!type) {
      setError("Please select a feedback type.");
      return;
    }

    if (!message.trim()) {
      setError("Please tell us more about your feedback.");
      return;
    }

    const feedback = {
      rating,
      type,
      message,
      createdAt: new Date().toISOString(),
    };

    const existingFeedback = JSON.parse(
      localStorage.getItem("booktracker-feedback") || "[]"
    );

    localStorage.setItem(
      "booktracker-feedback",
      JSON.stringify([feedback, ...existingFeedback])
    );

    setSubmitted(true);
    setError("");
  };

  if (submitted) {
    return (
      <section className="rounded-2xl border border-green-200 bg-green-50 p-5">
        <div className="flex gap-3">
          <CheckCircle2 className="h-6 w-6 shrink-0 text-green-600" />

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Thank you for your feedback
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Your feedback helps us improve the BookTracker experience.
            </p>

            <button
              onClick={() => {
                setSubmitted(false);
                setRating(0);
                setType("");
                setMessage("");
              }}
              className="mt-4 text-sm font-semibold text-blue-600"
            >
              Submit another feedback
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-medium text-blue-600">
          Share Your Experience
        </p>

        <h2 className="mt-1 text-2xl font-bold text-gray-900">
          Feedback & Suggestion
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Tell us what you think about BookTracker.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            How satisfied are you?
          </label>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  setRating(star);
                  setError("");
                }}
                className="transition hover:scale-110"
              >
                <Star
                  className={`h-7 w-7 ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Feedback Type
          </label>

          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setError("");
            }}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select feedback type</option>
            <option value="Suggestion">Suggestion</option>
            <option value="Bug Report">Bug Report</option>
            <option value="User Experience">User Experience</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Tell us more
          </label>

          <textarea
            rows={4}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setError("");
            }}
            placeholder="Write your feedback or suggestion..."
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {error && (
          <p className="text-xs font-medium text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Submit Feedback
        </button>
      </form>
    </section>
  );
}
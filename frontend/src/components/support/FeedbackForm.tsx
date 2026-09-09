import { useState } from "react";
import { CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface FeedbackErrors {
  rating?: string;
  comment?: string;
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<FeedbackErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): FeedbackErrors => {
    const errs: FeedbackErrors = {};
    if (rating === 0) errs.rating = "Please select a rating.";
    if (!comment.trim()) errs.comment = "Please leave a comment.";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  };

  const handleStarClick = (value: number) => {
    setRating(value);
    if (errors.rating) setErrors((prev) => ({ ...prev, rating: undefined }));
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    if (errors.comment) setErrors((prev) => ({ ...prev, comment: undefined }));
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <CheckCircle className="text-green-500 mb-3" size={40} />
        <p className="font-semibold text-gray-800">
          Thank you for your feedback!
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Your {RATING_LABELS[rating].toLowerCase()} rating helps us improve
          BookTracker.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setRating(0);
            setHovered(0);
            setComment("");
            setErrors({});
          }}
          className="mt-4 text-sm text-blue-600 font-medium hover:underline"
        >
          Submit another response
        </button>
      </div>
    );
  }

  const activeStars = hovered || rating;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Star Rating */}
      <div className="space-y-1">
        <Label>Rating</Label>
        <div className="flex items-center gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleStarClick(value)}
              onMouseEnter={() => setHovered(value)}
              onMouseLeave={() => setHovered(0)}
              aria-label={`Rate ${value} out of 5`}
              className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
            >
              <Star
                size={28}
                className={
                  value <= activeStars
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            </button>
          ))}
          {activeStars > 0 && (
            <span className="ml-2 text-sm text-gray-500 font-medium">
              {RATING_LABELS[activeStars]}
            </span>
          )}
        </div>
        {errors.rating && (
          <p className="text-xs text-red-500">{errors.rating}</p>
        )}
      </div>

      {/* Comment */}
      <div className="space-y-1">
        <Label htmlFor="feedback-comment">Comment</Label>
        <Textarea
          id="feedback-comment"
          placeholder="Tell us what you think about BookTracker..."
          rows={4}
          value={comment}
          onChange={handleCommentChange}
          className={
            errors.comment ? "border-red-400 focus-visible:ring-red-400" : ""
          }
        />
        {errors.comment && (
          <p className="text-xs text-red-500">{errors.comment}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
      >
        Submit Feedback
      </Button>
    </form>
  );
};

export default FeedbackForm;

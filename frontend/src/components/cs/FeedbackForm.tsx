import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface FeedbackErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface Feedback {
  name: string;
  email: string;
  rating: string;
  message: string;
}

const initialFeedback: Feedback = {
  name: "",
  email: "",
  rating: "5",
  message: "",
};

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState<Feedback>(initialFeedback);
  const [errors, setErrors] = useState<FeedbackErrors>({});

  const handleChange = (field: keyof Feedback, value: string) => {
    setFeedback((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): FeedbackErrors => {
    const next: FeedbackErrors = {};
    if (!feedback.name.trim()) next.name = "Name is required.";
    if (!feedback.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(feedback.email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!feedback.message.trim()) {
      next.message = "Feedback message is required.";
    } else if (feedback.message.trim().length < 10) {
      next.message = "Feedback should be at least 10 characters.";
    }
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    toast({
      title: "Feedback submitted",
      description: "Thank you! Your feedback helps us improve.",
    });
    setFeedback(initialFeedback);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="feedback-name">Name</Label>
        <Input
          id="feedback-name"
          value={feedback.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Your name"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="feedback-email">Email</Label>
        <Input
          id="feedback-email"
          type="email"
          value={feedback.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="feedback-rating">Rating</Label>
        <div id="feedback-rating" className="flex gap-2">
          {["1", "2", "3", "4", "5"].map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => handleChange("rating", value)}
              aria-label={`${value} star${value === "1" ? "" : "s"}`}
              className={
                feedback.rating === value
                  ? "text-xl text-primary"
                  : "text-xl text-muted-foreground"
              }
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="feedback-message">Message</Label>
        <Textarea
          id="feedback-message"
          value={feedback.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder="Tell us about your experience..."
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message}</p>
        )}
      </div>

      <Button type="submit">Submit Feedback</Button>
    </form>
  );
}

import { useState } from "react";
import { Smile, Meh, Frown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

type Satisfaction = "satisfied" | "neutral" | "unsatisfied";

const options: Array<{
  value: Satisfaction;
  label: string;
  icon: typeof Smile;
}> = [
  { value: "satisfied", label: "Satisfied", icon: Smile },
  { value: "neutral", label: "Neutral", icon: Meh },
  { value: "unsatisfied", label: "Unsatisfied", icon: Frown },
];

const initialSurveyState = {
  rating: null as Satisfaction | null,
  comment: "",
};

export default function UserSurvey() {
  const [survey, setSurvey] = useState(initialSurveyState);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!survey.rating) {
      setError("Please select a satisfaction rating.");
      return;
    }
    toast({
      title: "Survey submitted",
      description: "Thank you for your feedback on our support service.",
    });
    setSurvey(initialSurveyState);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">
          How satisfied are you with our support?
        </p>
        <div className="flex gap-3">
          {options.map((option) => {
            const Icon = option.icon;
            const active = survey.rating === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSurvey((prev) => ({ ...prev, rating: option.value }));
                  setError(null);
                }}
                aria-label={`Rate as ${option.label}`}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg border px-4 py-3 text-sm transition-colors",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input hover:bg-muted"
                )}
              >
                <Icon className="h-6 w-6" />
                {option.label}
              </button>
            );
          })}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="survey-comment"
          className="text-sm font-medium leading-none"
        >
          Tell us more (optional)
        </label>
        <Textarea
          id="survey-comment"
          value={survey.comment}
          onChange={(e) =>
            setSurvey((prev) => ({ ...prev, comment: e.target.value }))
          }
          placeholder="What could we do better?"
          rows={3}
        />
      </div>

      <Button type="submit">Submit Survey</Button>
    </form>
  );
}
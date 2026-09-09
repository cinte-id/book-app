import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const npsOptions = Array.from({ length: 11 }, (_, i) => i);

const questions = [
  {
    id: "ease",
    label: "How easy is it to use BookTracker?",
    options: ["Very Difficult", "Difficult", "Neutral", "Easy", "Very Easy"],
  },
  {
    id: "feature",
    label: "Which feature do you use most?",
    options: ["Reading Progress", "Library", "Discover", "Statistics", "User Guide"],
  },
  {
    id: "recommend",
    label: "Would you recommend BookTracker to a friend?",
    options: ["Definitely not", "Probably not", "Not sure", "Probably yes", "Definitely yes"],
  },
];

const SatisfactionSurvey = () => {
  const [nps, setNps] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing: string[] = [];
    if (nps === null) missing.push("nps");
    questions.forEach((q) => {
      if (!answers[q.id]) missing.push(q.id);
    });
    if (missing.length > 0) {
      setErrors(missing);
      return;
    }
    setSubmitted(true);
  };

  const npsLabel = nps === null ? "" : nps <= 6 ? "Detractor" : nps <= 8 ? "Passive" : "Promoter";
  const npsColor = nps === null ? "" : nps <= 6 ? "text-red-500" : nps <= 8 ? "text-yellow-500" : "text-green-500";

  if (submitted) {
    return (
      <div className="py-6 text-center space-y-3">
        <CheckCircle className="text-green-500 mx-auto" size={40} />
        <p className="font-semibold text-gray-800">Thank you for your response!</p>
        <p className="text-sm text-gray-500">Your feedback helps us build a better BookTracker.</p>
        <button
          onClick={() => {
            setSubmitted(false);
            setNps(null);
            setAnswers({});
            setComment("");
            setErrors([]);
          }}
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          Take survey again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* NPS */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-800">
          How likely are you to recommend BookTracker to a friend?
          <span className="text-red-500 ml-1">*</span>
        </p>
        <p className="text-xs text-gray-500">0 = Not at all likely · 10 = Extremely likely</p>
        <div className="flex gap-1 flex-wrap">
          {npsOptions.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setNps(n);
                setErrors((prev) => prev.filter((e) => e !== "nps"));
              }}
              className={`w-8 h-8 text-xs font-semibold rounded-lg border transition-colors ${
                nps === n
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border-gray-200 text-gray-600 hover:border-blue-300"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        {nps !== null && (
          <p className={`text-xs font-semibold ${npsColor}`}>{npsLabel}</p>
        )}
        {errors.includes("nps") && (
          <p className="text-xs text-red-500">Please select a score.</p>
        )}
      </div>

      {/* Multiple choice questions */}
      {questions.map((q) => (
        <div key={q.id} className="space-y-2">
          <p className="text-sm font-medium text-gray-800">
            {q.label}
            <span className="text-red-500 ml-1">*</span>
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            {q.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, [q.id]: opt }));
                  setErrors((prev) => prev.filter((e) => e !== q.id));
                }}
                className={`text-left text-sm px-3 py-2 rounded-lg border transition-colors ${
                  answers[q.id] === opt
                    ? "bg-blue-50 border-blue-400 text-blue-700 font-medium"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {errors.includes(q.id) && (
            <p className="text-xs text-red-500">Please select an option.</p>
          )}
        </div>
      ))}

      {/* Open comment */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-800">Any other comments? (optional)</p>
        <Textarea
          placeholder="Share your thoughts..."
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
        Submit Survey
      </Button>
    </form>
  );
};

export default SatisfactionSurvey;


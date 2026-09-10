import { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';
import { t } from '@/data/support/i18n';

interface HelpfulSurveyProps {
  topic: string;
  question?: string;
}

const keyFor = (topic: string) => `booktracker_csat_${topic}`;

/** Micro satisfaction survey: "Was this helpful?" with local persistence. */
const HelpfulSurvey = ({ topic, question }: HelpfulSurveyProps) => {
  const [answer, setAnswer] = useState<string | null>(() => {
    try {
      return localStorage.getItem(keyFor(topic));
    } catch {
      return null;
    }
  });

  const vote = (value: 'yes' | 'no') => {
    setAnswer(value);
    try {
      localStorage.setItem(keyFor(topic), value);
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {answer ? (
        <p className="flex items-center justify-center gap-2 text-center text-sm font-medium text-green-700">
          <CheckCircle2 size={18} />
          {t('surveyThanks')}
        </p>
      ) : (
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-sm font-medium text-gray-700">
            {question ?? 'Apakah halaman ini membantu?'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => vote('yes')}
              aria-label="Ya, membantu"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-600 transition-all hover:border-green-300 hover:bg-green-50 hover:text-green-700 active:scale-95"
            >
              <ThumbsUp size={15} />
              {t('surveyYes')}
            </button>
            <button
              onClick={() => vote('no')}
              aria-label="Tidak membantu"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-600 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700 active:scale-95"
            >
              <ThumbsDown size={15} />
              {t('surveyNo')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpfulSurvey;

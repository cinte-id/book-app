export interface Tutorial {
  id: number;
  title: string;
  description: string;
  steps: string[];
}

export const tutorials: Tutorial[] = [
  {
    id: 1,
    title: "Getting Started with Your Library",
    description:
      "Learn the basics of adding books and setting up your reading space.",
    steps: [
      "Create an account or sign in to your existing one.",
      "Browse the library or search for a book by title or author.",
      "Click 'Add to Library' and choose a reading status.",
      "Open your library to see all your saved books.",
    ],
  },
  {
    id: 2,
    title: "Setting Reading Goals",
    description:
      "Track your yearly book count and monthly page targets effortlessly.",
    steps: [
      "Go to the Goals section from the dashboard.",
      "Set your yearly book goal and monthly page goal.",
      "Review your progress bar and reading streak on the dashboard.",
      "Update your goals at any time as your ambitions grow.",
    ],
  },
  {
    id: 3,
    title: "Updating Your Reading Progress",
    description:
      "Keep your progress bars accurate as you move through a book.",
    steps: [
      "Open a book currently marked as 'Reading'.",
      "Update the current page number in the progress card.",
      "Your changes save automatically.",
      "Check your dashboard to see updated reading stats.",
    ],
  },
];

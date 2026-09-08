import { BookOpen, Library, RefreshCcw, Trash2 } from "lucide-react";

const steps = [
  {
    icon: Library,
    title: "Browse Library",
    description:
      "Open the Library section to explore the available books in BookTracker.",
  },
  {
    icon: BookOpen,
    title: "Add a Book",
    description:
      "Choose a book and add it to your personal reading list.",
  },
  {
    icon: RefreshCcw,
    title: "Update Reading Status",
    description:
      "Change the book status to Unread, Reading, or Completed as you progress.",
  },
  {
    icon: Trash2,
    title: "Manage Your Books",
    description:
      "Edit book information or remove books that you no longer want to track.",
  },
];

export default function UserGuide() {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-medium text-blue-600">
          Getting Started
        </p>

        <h2 className="mt-1 text-2xl font-bold text-gray-900">
          User Guide
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Follow these simple steps to start using BookTracker.
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-blue-600">
                    Step {index + 1}
                  </p>

                  <h3 className="mt-1 font-semibold text-gray-900">
                    {step.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
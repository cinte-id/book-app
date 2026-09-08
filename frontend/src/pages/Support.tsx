import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Headphones,
  BookOpen,
  MessageSquare,
} from "lucide-react";

import FAQSection from "@/components/support/FAQSection";
import ContactSupport from "@/components/support/ContactSupport";
import UserGuide from "@/components/support/UserGuide";
import FeedbackForm from "@/components/support/FeedbackForm";
import LiveChat from "@/components/support/LiveChat";

type SectionType = "faq" | "contact" | "guide" | "feedback" | null;

export default function Support() {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<SectionType>(null);

  const toggleSection = (section: SectionType) => {
    setOpenSection((current) =>
      current === section ? null : section
    );
  };

  const sectionButtonClass =
    "flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:bg-gray-50";

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto min-h-screen max-w-md bg-white px-5 py-6">
        <button
          onClick={() =>
            navigate("/", {
              state: { activeTab: "profile" },
            })
          }
          className="mb-5 flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </button>

        <div className="mb-6">
          <p className="text-sm font-medium text-blue-600">
            BookTracker Support
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            How can we help?
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Choose a support category below to find the help you need.
          </p>
        </div>

        <div className="space-y-3">
          {/* Help & FAQ */}
          <div>
            <button
              onClick={() => toggleSection("faq")}
              className={sectionButtonClass}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <HelpCircle size={20} />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    Help & FAQ
                  </p>
                  <p className="text-sm text-gray-500">
                    Find answers to common questions
                  </p>
                </div>
              </div>

              {openSection === "faq" ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {openSection === "faq" && (
              <div className="mt-4">
                <FAQSection />
              </div>
            )}
          </div>

          {/* Contact Support */}
          <div>
            <button
              onClick={() => toggleSection("contact")}
              className={sectionButtonClass}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <Headphones size={20} />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    Contact Support
                  </p>
                  <p className="text-sm text-gray-500">
                    Submit a support ticket
                  </p>
                </div>
              </div>

              {openSection === "contact" ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {openSection === "contact" && (
              <div className="mt-4">
                <ContactSupport />
              </div>
            )}
          </div>

          {/* User Guide */}
          <div>
            <button
              onClick={() => toggleSection("guide")}
              className={sectionButtonClass}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                  <BookOpen size={20} />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    User Guide
                  </p>
                  <p className="text-sm text-gray-500">
                    Learn how to use BookTracker
                  </p>
                </div>
              </div>

              {openSection === "guide" ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {openSection === "guide" && (
              <div className="mt-4">
                <UserGuide />
              </div>
            )}
          </div>

          {/* Feedback */}
          <div>
            <button
              onClick={() => toggleSection("feedback")}
              className={sectionButtonClass}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                  <MessageSquare size={20} />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    Feedback & Suggestion
                  </p>
                  <p className="text-sm text-gray-500">
                    Share your experience with us
                  </p>
                </div>
              </div>

              {openSection === "feedback" ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {openSection === "feedback" && (
              <div className="mt-4">
                <FeedbackForm />
              </div>
            )}
          </div>
        </div>
      </main>

      <LiveChat />
    </div>
  );
}
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SupportDashboard from "@/components/support/SupportDashboard";

export default function SupportDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto min-h-screen max-w-md bg-white px-5 py-6">
        <button
          onClick={() => navigate("/support")}
          className="mb-5 flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Support Center
        </button>

        <SupportDashboard />
      </main>
    </div>
  );
}
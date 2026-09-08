import CSDashboard from "@/components/cs/CSDashboard";
import CSAnalytics from "@/components/cs/CSAnalytics";

export default function DashboardPage() {
  return (
    <div className="w-full max-w-md mx-auto min-h-screen pb-24 p-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Support Dashboard</h1>
        <p className="text-muted-foreground">
          Track and manage customer support tickets.
        </p>
      </div>
      <CSAnalytics />
      <CSDashboard />
    </div>
  );
}
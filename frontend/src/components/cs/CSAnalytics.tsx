import {
  BarChart3,
  Ticket,
  CheckCircle2,
  Clock,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  analyticsSummary,
  ticketsByStatus,
  ticketsByCategory,
  weeklyVolume,
} from "@/data/analytics";

const statCards = [
  { label: "Total Tickets", value: analyticsSummary.totalTickets, icon: Ticket },
  {
    label: "Open Tickets",
    value: analyticsSummary.openTickets,
    icon: BarChart3,
  },
  {
    label: "Resolved",
    value: analyticsSummary.resolvedTickets,
    icon: CheckCircle2,
  },
  {
    label: "Avg Response (hrs)",
    value: analyticsSummary.avgResponseHours,
    icon: Clock,
  },
];

export default function CSAnalytics() {
  const maxWeekly = Math.max(...weeklyVolume.map((d) => d.tickets));

  return (
    <section className="w-full space-y-4">
      <CardHeader className="px-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-primary" />
          Customer Service Analytics
        </CardTitle>
        <CardDescription>Mockup overview of support performance.</CardDescription>
      </CardHeader>

      <div className="grid w-full grid-cols-2 gap-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <Icon className="mb-2 h-5 w-5 text-muted-foreground" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tickets by Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ticketsByStatus.map((status) => {
            const pct = Math.round(
              (status.value / analyticsSummary.totalTickets) * 100
            );
            return (
              <div key={status.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{status.name}</span>
                  <span className="text-muted-foreground">
                    {status.value} ({pct}%)
                  </span>
                </div>
                <Progress value={pct} />
              </div>
            );
          })}
          <p className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
            <Star className="h-4 w-4 text-yellow-500" />
            CSAT Score: {analyticsSummary.csatScore} / 5
          </p>
        </CardContent>
      </Card>

      <div className="grid w-full gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tickets by Category</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {ticketsByCategory.map((category) => (
              <Badge key={category.name} variant="secondary">
                {category.name}: {category.count}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Weekly Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-28 items-end gap-1.5">
              {weeklyVolume.map((day) => (
                <div
                  key={day.day}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-t bg-primary/80"
                    style={{
                      height: `${Math.max(4, (day.tickets / maxWeekly) * 100)}%`,
                    }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
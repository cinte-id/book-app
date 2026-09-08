import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tickets, type TicketStatus, type TicketPriority } from "@/data/tickets";
import { cn } from "@/lib/utils";

const statusOptions: Array<TicketStatus | "all"> = [
  "all",
  "open",
  "in-progress",
  "resolved",
];

const statusVariant: Record<TicketStatus, "default" | "secondary" | "outline"> =
  {
    open: "default",
    "in-progress": "secondary",
    resolved: "outline",
  };

const priorityClass: Record<TicketPriority, string> = {
  low: "text-green-600",
  medium: "text-yellow-600",
  high: "text-red-600",
};

export default function CSDashboard() {
  const [filter, setFilter] = useState<TicketStatus | "all">("all");

  const filteredTickets = useMemo(
    () =>
      filter === "all" ? tickets : tickets.filter((t) => t.status === filter),
    [filter]
  );

  const badgeLabel = (status: TicketStatus) =>
    status === "in-progress" ? "In Progress" : status;

  return (
    <div className="w-full max-w-md mx-auto min-h-screen pb-24 p-4 flex flex-col gap-4">
      <div className="flex flex-row gap-2 overflow-x-auto pb-2 shrink-0">
        {statusOptions.map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={cn(
              "shrink-0 rounded-md px-3 py-2 text-sm font-medium text-left transition-colors",
              filter === option
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {option === "all" ? "All Tickets" : badgeLabel(option)}
          </button>
        ))}
      </div>

      <Card className="flex-1 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Support Tickets</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">ID</TableHead>
                  <TableHead className="whitespace-nowrap min-w-[250px]">Subject</TableHead>
                  <TableHead className="whitespace-nowrap">Category</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">Priority</TableHead>
                  <TableHead className="whitespace-nowrap">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono text-xs whitespace-nowrap">
                      {ticket.id}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap min-w-[250px]">
                      {ticket.subject}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{ticket.category}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge variant={statusVariant[ticket.status]}>
                        {badgeLabel(ticket.status)}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "font-medium capitalize whitespace-nowrap",
                        priorityClass[ticket.priority]
                      )}
                    >
                      {ticket.priority}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {ticket.createdAt}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
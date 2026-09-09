import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { faqData } from "./faqData";

interface FAQSectionProps {
  searchQuery: string;
}

const FAQSection = ({ searchQuery }: FAQSectionProps) => {
  const query = searchQuery.trim().toLowerCase();

  // Filter by question, answer, or category
  const filtered = query
    ? faqData.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      )
    : faqData;

  // Group filtered results by category
  const grouped = filtered.reduce<Record<string, typeof faqData>>(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {}
  );

  const categories = Object.keys(grouped);

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <Search className="text-gray-300 mb-3" size={36} />
        <p className="text-gray-500 font-medium">No results found</p>
        <p className="text-sm text-gray-400 mt-1">
          No FAQs match{" "}
          <span className="font-semibold text-gray-600">"{searchQuery}"</span>.
          Try a different keyword.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {categories.map((category) => (
        <div key={category}>
          <Badge
            variant="secondary"
            className="mb-2 text-xs font-semibold uppercase tracking-wide"
          >
            {category}
          </Badge>

          <Accordion type="single" collapsible className="w-full">
            {grouped[category].map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="text-sm text-left font-medium text-gray-800 hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
};

export default FAQSection;

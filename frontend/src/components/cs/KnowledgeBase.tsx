import { useMemo, useState } from "react";
import { BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  knowledgeArticles,
  knowledgeCategories,
  type KnowledgeArticle,
} from "@/data/knowledge";
import { cn } from "@/lib/utils";

export default function KnowledgeBase() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selected, setSelected] = useState<KnowledgeArticle | null>(null);

  const filteredArticles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return knowledgeArticles.filter((article) => {
      const matchesCategory =
        activeCategory === "All" || article.category === activeCategory;
      const matchesQuery =
        normalized.length === 0 ||
        article.title.toLowerCase().includes(normalized) ||
        article.excerpt.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <section className="w-full space-y-4">
      <CardHeader className="px-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-primary" />
          Knowledge Base
        </CardTitle>
        <CardDescription>
          Browse helpful articles by category.
        </CardDescription>
      </CardHeader>

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles..."
        aria-label="Search knowledge base"
      />

      <div className="flex flex-wrap gap-2">
        {knowledgeCategories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category);
              setSelected(null);
            }}
            className={cn(
              "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
              activeCategory === category
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {selected ? (
        <Card>
          <CardHeader>
            <Badge variant="secondary" className="w-fit">
              {selected.category}
            </Badge>
            <CardTitle className="text-base">{selected.title}</CardTitle>
            <CardDescription>{selected.excerpt}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              This is a preview of the full article. For the purpose of this UI
              test, the complete body content is intentionally kept short. In a
              real knowledge base, this section would contain the full
              step-by-step instructions, images, and related links.
            </p>
            <p className="text-xs text-muted-foreground">
              {selected.views.toLocaleString()} views
            </p>
            <button
              onClick={() => setSelected(null)}
              className="text-sm text-primary hover:underline"
            >
              &larr; Back to all articles
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid w-full gap-3 sm:grid-cols-2">
          {filteredArticles.map((article) => (
            <button
              key={article.id}
              onClick={() => setSelected(article)}
              className="text-left"
            >
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2">
                    {article.category}
                  </Badge>
                  <p className="font-medium text-sm leading-snug">
                    {article.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {article.excerpt}
                  </p>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}

      {!selected && filteredArticles.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No articles found for &quot;{query}&quot;.
        </p>
      )}
    </section>
  );
}
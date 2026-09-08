import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      aria-label="Toggle language"
      className="gap-1.5"
    >
      <Languages className="h-4 w-4" />
      {language === "en" ? "ID" : "EN"}
    </Button>
  );
}
import FaqSearch from "@/components/cs/FaqSearch";
import TutorialTabs from "@/components/cs/TutorialTabs";
import KnowledgeBase from "@/components/cs/KnowledgeBase";
import LanguageToggle from "@/components/cs/LanguageToggle";
import { useLanguage } from "@/hooks/use-language";

export default function HelpCenter() {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-md mx-auto min-h-screen pb-24 p-4 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("help.title")}</h1>
          <p className="text-muted-foreground">{t("help.subtitle")}</p>
        </div>
        <LanguageToggle />
      </div>

      <FaqSearch />
      <div className="space-y-4">
        <h2 className="text-xl font-bold">{t("help.tutorials")}</h2>
        <TutorialTabs />
      </div>
      <KnowledgeBase />
    </div>
  );
}
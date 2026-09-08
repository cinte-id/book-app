import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  translations,
  languages,
  type Language,
} from "@/data/translations";

interface LanguageContextValue {
  language: Language;
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = useCallback(
    (key: string) => {
      const [section, field] = key.split(".");
      const dict = translations[language] as Record<
        string,
        Record<string, string>
      >;
      if (!dict[section] || !dict[section][field]) return key;
      return dict[section][field];
    },
    [language]
  );

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) =>
      languages[(languages.indexOf(prev) + 1) % languages.length]
    );
  }, []);

  return (
    <LanguageContext.Provider
      value={{ language, t, setLanguage, toggleLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
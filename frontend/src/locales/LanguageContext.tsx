import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import en from "./en";
import id from "./id";

type Language = "en" | "id";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: typeof en;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

type LanguageProviderProps = {
  children: ReactNode;
};

export const LanguageProvider = ({
  children,
}: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage === "id" || savedLanguage === "en") {
      return savedLanguage;
    }

    return "en";
  });

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const translations = language === "id" ? id : en;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used within LanguageProvider"
    );
  }

  return context;
};
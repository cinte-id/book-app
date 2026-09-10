
import { Book, Search, User, TrendingUp, Home } from "lucide-react";
import { useLanguage } from "../locales/LanguageContext";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNav = ({ activeTab, setActiveTab }: BottomNavProps) => {
  const { t } = useLanguage();

  const navItems = [
    {
      id: "home",
      icon: Home,
      label: t.navigation.home,
    },
    {
      id: "library",
      icon: Book,
      label: t.navigation.library,
    },
    {
      id: "discover",
      icon: Search,
      label: t.navigation.discover,
    },
    {
      id: "reading",
      icon: TrendingUp,
      label: t.navigation.reading,
    },
    {
      id: "profile",
      icon: User,
      label: t.navigation.profile,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-2 px-3 transition-all duration-200 ${
                isActive
                  ? "text-blue-600 transform scale-105"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Icon
                size={20}
                className="mb-1"
              />

              <span
                className={`text-xs ${
                  isActive ? "font-medium" : ""
                }`}
              >
                {item.label}
              </span>

              {isActive && (
                <div className="w-1 h-1 bg-blue-600 rounded-full mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

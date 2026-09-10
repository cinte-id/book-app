import { Bell, Search } from "lucide-react";
import { useLanguage } from "../locales/LanguageContext";

interface HeaderNavProps {
  activeTab: string;
}

const HeaderNav = ({ activeTab }: HeaderNavProps) => {
  const { t } = useLanguage();

  const getTitle = () => {
    switch (activeTab) {
      case "library":
        return t.navigation.library;

      case "discover":
        return t.navigation.discover;

      case "reading":
        return t.navigation.reading;

      case "profile":
        return t.navigation.profile;

      default:
        return "BookTracker";
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 px-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">
          {getTitle()}
        </h1>

        <div className="flex items-center space-x-3">
          {activeTab !== "discover" && (
            <button
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          )}

          <button
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={20} />

            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderNav;


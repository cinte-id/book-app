import { Bell, Search, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderNavProps {
  activeTab: string;
}

const HeaderNav = ({ activeTab }: HeaderNavProps) => {
  const getTitle = () => {
    switch (activeTab) {
      case 'library': return 'My Library';
      case 'discover': return 'Discover';
      case 'reading': return 'Reading';
      case 'profile': return 'Profile';
      default: return 'BookTracker';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 px-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">{getTitle()}</h1>
        <div className="flex items-center space-x-2">
          {activeTab !== 'discover' && (
            <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
              <Search size={20} />
            </button>
          )}
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Akses Cepat Bantuan Pengguna */}
          <Link
            to="/help"
            title="Pusat Bantuan & FAQ"
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <HelpCircle size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HeaderNav;
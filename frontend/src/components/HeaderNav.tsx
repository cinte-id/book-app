
import { Bell, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderNavProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
}

const HeaderNav = ({ activeTab, setActiveTab }: HeaderNavProps) => {
  const navigate = useNavigate();

  const getTitle = () => {
    switch (activeTab) {
      case 'library': return 'My Library';
      case 'discover': return 'Discover';
      case 'reading': return 'Reading';
      case 'profile': return 'Profile';
      default: return 'BookTracker';
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'library', label: 'Library' },
    { id: 'discover', label: 'Discover' },
    { id: 'reading', label: 'Reading' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 px-4 py-4 md:px-8 md:py-5 md:rounded-b-2xl md:mb-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">{getTitle()}</h1>
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab && setActiveTab(item.id)}
              className={`text-sm font-medium transition-colors ${
                activeTab === item.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 md:space-x-4">
          {activeTab !== 'discover' && (
            <button 
              onClick={() => navigate('/?tab=library&view=browse')}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors bg-gray-50 rounded-full md:bg-transparent"
            >
              <Search size={20} />
            </button>
          )}
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors relative bg-gray-50 rounded-full md:bg-transparent">
            <Bell size={20} />
            <span className="absolute top-1 right-1 md:top-2 md:right-2 w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderNav;

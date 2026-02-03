import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  value?: string;
}

const SearchBar = ({ onSearch, placeholder = "Search books by title, author, or genre...", value = "" }: SearchBarProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-10 w-full"
      />
    </div>
  );
};

export default SearchBar;
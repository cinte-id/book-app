import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GenreFilterProps {
  onFilterChange: (genre: string) => void;
  genres: string[];
  currentGenre?: string;
}

const GenreFilter = ({ onFilterChange, genres, currentGenre = "all" }: GenreFilterProps) => {
  return (
    <Select onValueChange={onFilterChange} value={currentGenre}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All Genres" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Genres</SelectItem>
        {genres.map((genre) => (
          <SelectItem key={genre} value={genre}>
            {genre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default GenreFilter;
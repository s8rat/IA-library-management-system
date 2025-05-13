import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus, faBars } from "@fortawesome/free-solid-svg-icons";

interface SearchBarProps {
  onAdd?: () => void;
  onSearch?: (searchTerm: string) => void;
  placeholder?: string;
  onToggleSidebar?: () => void;
}

const SearchBar = ({ 
  onAdd, 
  onSearch, 
  placeholder = "Search by name",
  onToggleSidebar
}: SearchBarProps) => (
  <div className="flex items-center gap-2 sm:gap-4 mb-6 w-full">
    {/* Mobile menu button */}
    {onToggleSidebar && (
      <button
        className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border bg-white shadow"
        onClick={onToggleSidebar}
        aria-label="Toggle menu"
      >
        <FontAwesomeIcon className="text-gray-500" icon={faBars} />
      </button>
    )}
    
    <div className="flex items-center flex-1 bg-white rounded-full border px-3 sm:px-4 py-2 shadow-sm">
      <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-2 flex-shrink-0" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full outline-none bg-transparent text-gray-700 text-sm sm:text-base"
        onChange={(e) => onSearch?.(e.target.value)}
      />
    </div>
    
    {onAdd && (
      <button
        className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full border bg-white shadow text-xl"
        onClick={onAdd}
        aria-label="Add new"
      >
        <FontAwesomeIcon className="text-gray-500" icon={faPlus} />
      </button>
    )}
  </div>
);

export default SearchBar;

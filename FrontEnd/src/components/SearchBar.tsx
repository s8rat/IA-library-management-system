import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";

interface SearchBarProps {
  onAdd?: () => void;
}

const SearchBar = ({ onAdd }: SearchBarProps) => (
  <div className="flex items-center gap-4 mb-6">
    <div className="flex items-center w-full max-w-xl bg-white rounded-full border px-4 py-2 shadow-sm">
      <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-2" />
      <input
        type="text"
        placeholder="Search by name"
        className="flex-1 outline-none bg-transparent text-gray-700"
      />
    </div>
    <button
      className="w-10 h-10 flex items-center justify-center rounded-full border bg-white shadow text-xl"
      onClick={onAdd}
    >
      <FontAwesomeIcon className="text-gray-400" icon={faPlus} />
    </button>
  </div>
);

export default SearchBar;

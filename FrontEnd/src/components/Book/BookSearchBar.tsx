import React from "react";

interface BookSearchBarProps {
  search: string;
  setSearch: (search: string) => void;
  onAdd: () => void;
  className?: string;
}

const BookSearchBar: React.FC<BookSearchBarProps> = ({
  search,
  setSearch,
  onAdd,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-4 mb-6 ${className}`}>
      <input
        type="text"
        placeholder="Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 px-4 py-2 border bg-gray-200 border-gray-300 rounded-lg focus:outline-none"
      />
      <button
        onClick={onAdd}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Add Book
      </button>
    </div>
  );
};

export default BookSearchBar;

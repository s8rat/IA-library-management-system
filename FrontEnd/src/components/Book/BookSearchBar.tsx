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
    <div className={`flex flex-col sm:flex-row text-black items-center gap-3 mb-6 w-full ${className}`}>
      <input
        type="text"
        placeholder="Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:flex-1 px-4 py-2 border bg-gray-200 border-gray-300 rounded-lg focus:outline-none"
      />
      <button
        onClick={onAdd}
        className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        <span>Add Book</span>
      </button>
    </div>
  );
};

export default BookSearchBar;

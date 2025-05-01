import React from "react";

interface BookSearchBarProps {
  search: string;
  setSearch: (s: string) => void;
  onAdd: () => void;
}

const BookSearchBar: React.FC<BookSearchBarProps> = ({
  search,
  setSearch,
  onAdd,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      marginBottom: 20,
      gap: 12,
      width: "100%",
      justifyContent: "center",
    }}
  >
    <input
      type="text"
      placeholder="Search by title or author"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        flex: 1,
        padding: 8,
        borderRadius: 4,
        border: "1px solid #ccc",
        maxWidth: 350,
        background: "#fff",
        color: "#000",
      }}
    />
    <button
      onClick={onAdd}
      style={{
        padding: "6px 18px",
        borderRadius: 4,
        background: "#1976d2",
        color: "#fff",
        border: "none",
        cursor: "pointer",
      }}
    >
      Add Book
    </button>
  </div>
);

export default BookSearchBar;

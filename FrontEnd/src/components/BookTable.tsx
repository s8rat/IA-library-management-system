import React from "react";

type Book = {
  id: number;
  title: string;
  author: string;
  isbn: string;
};

interface BookTableProps {
  books: Book[];
  editingBook: Book | null;
  originalBook: Book | null;
  setEditingBook: (book: Book | null) => void;
  setOriginalBook: (book: Book | null) => void;
  handleSave: () => void;
  handleCancelEdit: () => void;
  handleEditBook: (book: Book) => void;
  handleDeleteBook: (id: number) => void;
}

const BookTable: React.FC<BookTableProps> = ({
  books,
  editingBook,
  originalBook,
  setEditingBook,
  handleSave,
  handleCancelEdit,
  handleEditBook,
  handleDeleteBook,
}) => (
  <div className="bg-white rounded-lg shadow p-6 w-full flex flex-col items-center">
    <h2 className="mb-4 text-center w-full text-xl font-semibold">Book List</h2>
    <table className="w-full border-collapse text-center">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-3 border-b text-gray-800">Title</th>
          <th className="py-2 px-3 border-b text-gray-800">Author</th>
          <th className="py-2 px-3 border-b text-gray-800">Actions</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <tr
            key={book.id}
            className={
              editingBook && editingBook.id === book.id
                ? "bg-blue-50"
                : "hover:bg-gray-50"
            }
          >
            <td className="py-2 px-3 border-b text-gray-900">
              {editingBook && editingBook.id === book.id ? (
                <input
                  type="text"
                  value={editingBook.title}
                  placeholder={originalBook?.title || ""}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      title: e.target.value,
                    })
                  }
                  className="w-11/12 px-2 py-1 rounded border border-gray-300 bg-white text-gray-900"
                />
              ) : (
                <strong>{book.title}</strong>
              )}
            </td>
            <td className="py-2 px-3 border-b text-gray-900">
              {editingBook && editingBook.id === book.id ? (
                <input
                  type="text"
                  value={editingBook.author}
                  placeholder={originalBook?.author || ""}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      author: e.target.value,
                    })
                  }
                  className="w-11/12 px-2 py-1 rounded border border-gray-300 bg-white text-gray-900"
                />
              ) : (
                book.author
              )}
            </td>
            <td className="py-2 px-3 border-b">
              {editingBook && editingBook.id === book.id ? (
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 rounded bg-gray-400 text-white hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleEditBook(book)}
                    className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book.id)}
                    className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
        {books.length === 0 && (
          <tr>
            <td colSpan={3} className="text-center py-4 text-gray-400">
              No books found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default BookTable;

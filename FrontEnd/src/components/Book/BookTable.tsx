import React from "react";
import { Book } from "../../types/book";

interface BookTableProps {
  books: Book[];
  handleEditBook: (book: Book) => void;
  handleDeleteBook: (id: number) => void;
  className?: string;
  customActions?: React.ReactNode;
}

const BookTable: React.FC<BookTableProps> = ({
  books,
  handleEditBook,
  handleDeleteBook,
  className = "",
  customActions,
}) => (
  <div className={`bg-white rounded-lg shadow p-6 w-full flex flex-col items-center ${className}`}>
    <h2 className="mb-4 text-center w-full text-xl font-semibold text-gray-800">Book List</h2>
    <table className="w-full border-collapse text-center">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-3 px-4 border-b text-gray-800 font-semibold">Cover</th>
          <th className="py-3 px-4 border-b text-gray-800 font-semibold">Title</th>
          <th className="py-3 px-4 border-b text-gray-800 font-semibold">Author</th>
          <th className="py-3 px-4 border-b text-gray-800 font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <tr key={book.id} className="hover:bg-gray-50">
            <td className="py-3 px-4 border-b">
              {book.coverImage ? (
                <img
                  src={`data:${book.coverImageContentType || 'image/jpeg'};base64,${book.coverImage}`}
                  alt={`${book.title} cover`}
                  className="w-16 h-20 object-cover rounded shadow-sm mx-auto"
                />
              ) : (
                <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center mx-auto">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
            </td>
            <td className="py-3 px-4 border-b text-gray-900">
              <strong>{book.title}</strong>
            </td>
            <td className="py-3 px-4 border-b text-gray-900">
              {book.author}
            </td>
            <td className="py-3 px-4 border-b">
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => handleEditBook(book)}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBook(book.id)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                >
                  Delete
                </button>
                {customActions}
              </div>
            </td>
          </tr>
        ))}
        {books.length === 0 && (
          <tr>
            <td colSpan={4} className="text-center py-8 text-gray-400">
              No books found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default BookTable; 
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
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow p-4 sm:p-6 w-full flex flex-col items-center ${className}`}
    >
      <h2 className="mb-4 text-center w-full text-xl font-semibold text-gray-800">
        Book List
      </h2>
      
      {/* Desktop view - Table */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full border-collapse text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border-b text-gray-800 font-semibold">
                Cover
              </th>
              <th className="py-3 px-4 border-b text-gray-800 font-semibold">
                Title
              </th>
              <th className="py-3 px-4 border-b text-gray-800 font-semibold">
                Author
              </th>
              <th className="py-3 px-4 border-b text-gray-800 font-semibold">
                Description
              </th>
              <th className="py-3 px-4 border-b text-gray-800 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">
                  {book.coverImage ? (
                    <img
                      src={`data:${
                        book.coverImageContentType || "image/jpeg"
                      };base64,${book.coverImage}`}
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
                <td className="py-3 px-4 border-b text-gray-900">{book.author}</td>
                <td className="py-3 px-4 border-b text-gray-900">
                  <div className="max-w-xs overflow-hidden">
                    {book.description ? (
                      <p
                        className="text-sm text-gray-600 truncate"
                        title={book.description}
                      >
                        {book.description}
                      </p>
                    ) : (
                      <span className="text-gray-400 text-sm">No description</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 border-b">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleEditBook(book)}
                      className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
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
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile view - Cards */}
      <div className="md:hidden w-full grid grid-cols-1 gap-4">
        {books.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No books found.</div>
        ) : (
          books.map((book) => (
            <div key={book.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex justify-center">
                  {book.coverImage ? (
                    <img
                      src={`data:${
                        book.coverImageContentType || "image/jpeg"
                      };base64,${book.coverImage}`}
                      alt={`${book.title} cover`}
                      className="w-24 h-32 object-cover rounded shadow-sm"
                    />
                  ) : (
                    <div className="w-24 h-32 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-1">{book.title}</h3>
                  <p className="text-gray-700 mb-2">{book.author}</p>
                  <div className="mb-3">
                    {book.description ? (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {book.description}
                      </p>
                    ) : (
                      <span className="text-gray-400 text-sm">No description</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <button
                      onClick={() => handleEditBook(book)}
                      className="px-3 py-1 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="px-3 py-1 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition text-sm"
                    >
                      Delete
                    </button>
                    {customActions}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookTable;

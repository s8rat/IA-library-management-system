import React from "react";
import { Book } from "../types/book";

interface BookEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editingBook: Book;
  setEditingBook: (book: Book) => void;
  editBookImage: File | null;
  setEditBookImage: (file: File | null) => void;
  editBookError: string | null;
}

const BookEditDialog: React.FC<BookEditDialogProps> = ({
  open,
  onClose,
  onSubmit,
  editingBook,
  setEditingBook,
  editBookImage,
  setEditBookImage,
  editBookError,
}) => {
  if (!open || !editingBook) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
        <button
          className="absolute top-3 right-3 bg-transparent text-black hover:text-red-600 text-xl"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          &times;
        </button>
        <h2 className="font-bold text-2xl mb-6 text-center text-blue-900 tracking-wide">
          Edit Book
        </h2>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editingBook.title}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, title: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editingBook.author}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, author: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                ISBN
              </label>
              <input
                type="text"
                value={editingBook.isbn}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, isbn: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditBookImage(e.target.files ? e.target.files[0] : null)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              {editBookImage && (
                <div className="mt-2 flex justify-center">
                  <img
                    src={URL.createObjectURL(editBookImage)}
                    alt="Preview"
                    className="h-28 w-auto rounded shadow border"
                  />
                </div>
              )}
            </div>
          </div>
          {editBookError && (
            <div className="text-red-600 text-center text-sm mt-2">
              {editBookError}
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookEditDialog;

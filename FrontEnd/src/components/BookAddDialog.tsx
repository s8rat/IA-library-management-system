import React from "react";

interface BookAddDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newBook: { title: string; author: string; isbn: string };
  setNewBook: (book: { title: string; author: string; isbn: string }) => void;
  newBookImage: File | null;
  setNewBookImage: (file: File | null) => void;
  addError: string | null;
}

const BookAddDialog: React.FC<BookAddDialogProps> = ({
  open,
  onClose,
  onSubmit,
  newBook,
  setNewBook,
  newBookImage,
  setNewBookImage,
  addError,
}) => {
  if (!open) return null;
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
          Add New Book
        </h2>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newBook.title}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
                autoFocus
              />
            </div>
            {/* Author */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newBook.author}
                onChange={(e) =>
                  setNewBook({ ...newBook, author: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
            {/* ISBN */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                ISBN
              </label>
              <input
                type="text"
                value={newBook.isbn}
                onChange={(e) =>
                  setNewBook({ ...newBook, isbn: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Optional"
              />
            </div>
            {/* Cover Image */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewBookImage(e.target.files ? e.target.files[0] : null)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              {newBookImage && (
                <div className="mt-2 flex justify-center">
                  <img
                    src={URL.createObjectURL(newBookImage)}
                    alt="Preview"
                    className="h-28 w-auto rounded shadow border"
                  />
                </div>
              )}
            </div>
          </div>
          {addError && (
            <div className="text-red-600 text-center text-sm mt-2">
              {addError}
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
            >
              Add Book
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

export default BookAddDialog;

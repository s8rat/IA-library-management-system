import React, { useState, useEffect } from "react";

interface BookAddDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;  newBook: {
    title: string;
    author: string;
    isbn: string;
    quantity: number;
    description: string;
  };
  setNewBook: (book: {
    title: string;
    author: string;
    isbn: string;
    quantity: number;
    description: string;
  }) => void;
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
  setNewBookImage,
  addError,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setPreviewUrl(null);
    }
  }, [open]);

  if (!open) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewBookImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
            {/* Cover Image */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Cover Image
              </label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No image</span>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended size: 300x450px
                  </p>
                </div>
              </div>
            </div>
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
                placeholder="ISBN"
              />
            </div>
            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={newBook.quantity ?? ""}
                onChange={(e) =>
                  setNewBook({ ...newBook, quantity: Number(e.target.value) })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Description
              </label>
              <textarea
                value={newBook.description}
                onChange={(e) =>
                  setNewBook({ ...newBook, description: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                rows={4}
                placeholder="Enter book description..."
              />
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

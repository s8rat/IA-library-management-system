import { Dialog } from "@headlessui/react";
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
  setNewBookImage,
  addError,
}) => (
  <Dialog open={open} onClose={onClose} className="relative z-50">
    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel className="bg-white rounded-xl p-8 min-w-[350px] max-w-[420px] shadow-lg w-full">
        <Dialog.Title className="font-bold text-2xl mb-5 text-center tracking-wide">
          Add New Book
        </Dialog.Title>
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="font-medium mb-0.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter book title"
              value={newBook.title}
              onChange={(e) =>
                setNewBook({ ...newBook, title: e.target.value })
              }
              required
              className="p-2 rounded border border-gray-300 bg-white text-gray-900 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium mb-0.5">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter author name"
              value={newBook.author}
              onChange={(e) =>
                setNewBook({ ...newBook, author: e.target.value })
              }
              required
              className="p-2 rounded border border-gray-300 bg-white text-gray-900 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium mb-0.5">
              ISBN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter ISBN"
              value={newBook.isbn}
              onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
              required
              className="p-2 rounded border border-gray-300 bg-white text-gray-900 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium mb-0.5">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewBookImage(e.target.files ? e.target.files[0] : null)
              }
              className="p-1 rounded border border-gray-300 bg-white text-gray-900 text-base"
            />
          </div>
          {addError && (
            <div className="text-red-600 mb-1 text-center">{addError}</div>
          )}
          <div className="flex gap-3 justify-end mt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded bg-blue-700 text-white font-medium hover:bg-blue-800 transition"
            >
              Add
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded bg-gray-400 text-white font-medium hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </Dialog.Panel>
    </div>
  </Dialog>
);

export default BookAddDialog;

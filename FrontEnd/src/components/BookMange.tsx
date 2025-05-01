import React, { useState, useEffect } from "react";
import axios from "axios";
import BookAddDialog from "./BookAddDialog";
import BookTable from "./BookTable";
import BookSearchBar from "./BookSearchBar";

type Book = {
  id: number;
  title: string;
  author: string;
  isbn: string;
};

const BookManage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState({ title: "", author: "", isbn: "" });
  const [newBookImage, setNewBookImage] = useState<File | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [originalBook, setOriginalBook] = useState<Book | null>(null);
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("/api/Books")
      .then((response) => {
        const data = Array.isArray(response.data)
          ? response.data.map((b: Book) => ({
              id: b.id,
              title: b.title,
              author: b.author,
              isbn: b.isbn,
            }))
          : [];
        setBooks(data);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  const handleAddBook = (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    setAddError(null);
    if (newBook.title && newBook.author && newBook.isbn) {
      const formData = new FormData();
      formData.append("Title", newBook.title);
      formData.append("Author", newBook.author);
      formData.append("ISBN", newBook.isbn);
      if (newBookImage) {
        formData.append("CoverImageFile", newBookImage);
      }
      axios
        .post("/api/Books", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          const b = response.data;
          setBooks([
            ...books,
            {
              id: b.id,
              title: b.title,
              author: b.author,
              isbn: b.isbn,
            },
          ]);
          setNewBook({ title: "", author: "", isbn: "" });
          setNewBookImage(null);
          setIsAddDialogOpen(false);
        })
        .catch((error) => {
          console.error("Error adding book:", error);
          setAddError(error.response?.data?.message || "Failed to add book");
        });
    } else {
      setAddError("Title, Author, and ISBN are required");
    }
  };

  const handleSave = () => {
    if (editingBook && originalBook) {
      const formData = new FormData();
      formData.append("Title", editingBook.title);
      formData.append("Author", editingBook.author);
      formData.append("ISBN", originalBook.isbn || "");
      axios
        .put(`/api/Books/${editingBook.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          const b = response.data;
          setBooks(
            books.map((book) =>
              book.id === editingBook.id
                ? { id: b.id, title: b.title, author: b.author, isbn: b.isbn }
                : book
            )
          );
          setEditingBook(null);
          setOriginalBook(null);
        })
        .catch((error) => console.error("Error updating book:", error));
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook({ ...book });
    setOriginalBook({ ...book });
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
    setOriginalBook(null);
  };

  const handleDeleteBook = (id: number) => {
    axios
      .delete(`/api/Books/${id}`)
      .then(() => {
        setBooks(books.filter((book) => book.id !== id));
      })
      .catch((error) => console.error("Error deleting book:", error));
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  const inputPlaceholderStyle = `
    input::placeholder {
        color: #000 !important;
        opacity: 1;
        background: #fff !important;
    }
  `;

  return (
    <>
      <style>{inputPlaceholderStyle}</style>
      <BookAddDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddBook}
        newBook={newBook}
        setNewBook={setNewBook}
        newBookImage={newBookImage}
        setNewBookImage={setNewBookImage}
        addError={addError}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#f5f5f5",
        }}
      >
        <div
          style={{
            maxWidth: 600,
            width: "100%",
            margin: "40px auto",
            padding: 24,
            background: "#fafafa",
            borderRadius: 8,
            boxShadow: "0 2px 8px #eee",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1 style={{ textAlign: "center", marginBottom: 32, width: "100%" }}>
            Book Management
          </h1>
          <BookSearchBar
            search={search}
            setSearch={setSearch}
            onAdd={() => setIsAddDialogOpen(true)}
          />
          <BookTable
            books={filteredBooks}
            editingBook={editingBook}
            originalBook={originalBook}
            setEditingBook={setEditingBook}
            setOriginalBook={setOriginalBook}
            handleSave={handleSave}
            handleCancelEdit={handleCancelEdit}
            handleEditBook={handleEditBook}
            handleDeleteBook={handleDeleteBook}
          />
        </div>
      </div>
    </>
  );
};

export default BookManage;

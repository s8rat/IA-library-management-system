import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Add Headless UI Dialog import
import { Dialog } from '@headlessui/react';

type Book = {
    id: number;
    title: string;
    author: string;
    isbn: string; 
};

const BookManage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '' });
    const [newBookImage, setNewBookImage] = useState<File | null>(null);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [originalBook, setOriginalBook] = useState<Book | null>(null);
    const [search, setSearch] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch books from the database
        axios.get('/api/Books')
            .then((response) => {
                // Ensure the data is mapped to Book[]
                const data = Array.isArray(response.data)
                    ? response.data.map((b: { id: number; title: string; author: string; isbn: string }) => ({
                        id: b.id,
                        title: b.title,
                        author: b.author,
                        isbn: b.isbn
                    }))
                    : [];
                setBooks(data);
            })
            .catch((error) => console.error('Error fetching books:', error));
    }, []);

    const handleAddBook = (event?: React.FormEvent) => {
        if (event) event.preventDefault();
        setAddError(null);
        if (newBook.title && newBook.author && newBook.isbn) {
            const formData = new FormData();
            formData.append('Title', newBook.title);
            formData.append('Author', newBook.author);
            formData.append('ISBN', newBook.isbn);
            if (newBookImage) {
                formData.append('CoverImageFile', newBookImage);
            }
            // Debug: log FormData keys/values
            for (const pair of formData.entries()) {
                console.log(pair[0]+ ': ' + pair[1]);
            }
            axios.post('/api/Books', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then((response) => {
                    const b = response.data;
                    setBooks([...books, {
                        id: b.id,
                        title: b.title,
                        author: b.author,
                        isbn: b.isbn
                    }]);
                    setNewBook({ title: '', author: '', isbn: '' });
                    setNewBookImage(null);
                    setIsAddDialogOpen(false);
                })
                .catch((error) => {
                    console.error('Error adding book:', error);
                    setAddError(error.response?.data?.message || 'Failed to add book');
                });
        } else {
            setAddError('Title, Author, and ISBN are required');
        }
    };

    const handleSave = () => {
        if (editingBook && originalBook) {
            const formData = new FormData();
            // Only update title and author, keep ISBN as it was
            formData.append('Title', editingBook.title);
            formData.append('Author', editingBook.author);
            formData.append('ISBN', originalBook.isbn || '');

            axios
                .put(`/api/Books/${editingBook.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
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
                .catch((error) => console.error('Error updating book:', error));
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
        axios.delete(`/api/Books/${id}`) // Corrected to use '/api/Books'
            .then(() => {
                setBooks(books.filter((book) => book.id !== id));
            })
            .catch((error) => console.error('Error deleting book:', error));
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
            {/* Add Book Dialog */}
            <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 350, maxWidth: 420, boxShadow: '0 4px 24px #0002' }}>
                        <Dialog.Title style={{ fontWeight: 700, fontSize: 22, marginBottom: 20, textAlign: 'center', letterSpacing: 1 }}>Add New Book</Dialog.Title>
                        <form
                            onSubmit={handleAddBook}
                            style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <label style={{ fontWeight: 500, marginBottom: 2 }}>
                                    Title <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter book title"
                                    value={newBook.title}
                                    onChange={e => setNewBook({ ...newBook, title: e.target.value })}
                                    required
                                    style={{ padding: 10, borderRadius: 6, border: '1px solid #bbb', background: '#fff', color: '#222', fontSize: 15 }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <label style={{ fontWeight: 500, marginBottom: 2 }}>
                                    Author <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter author name"
                                    value={newBook.author}
                                    onChange={e => setNewBook({ ...newBook, author: e.target.value })}
                                    required
                                    style={{ padding: 10, borderRadius: 6, border: '1px solid #bbb', background: '#fff', color: '#222', fontSize: 15 }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <label style={{ fontWeight: 500, marginBottom: 2 }}>
                                    ISBN <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter ISBN"
                                    value={newBook.isbn}
                                    onChange={e => setNewBook({ ...newBook, isbn: e.target.value })}
                                    required
                                    style={{ padding: 10, borderRadius: 6, border: '1px solid #bbb', background: '#fff', color: '#222', fontSize: 15 }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <label style={{ fontWeight: 500, marginBottom: 2 }}>
                                    Cover Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setNewBookImage(e.target.files ? e.target.files[0] : null)}
                                    style={{ padding: 7, borderRadius: 6, border: '1px solid #bbb', background: '#fff', color: '#222', fontSize: 15 }}
                                />
                            </div>
                            {addError && (
                                <div style={{ color: 'red', marginBottom: 4, textAlign: 'center' }}>{addError}</div>
                            )}
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 10 }}>
                                <button
                                    type="submit"
                                    style={{ padding: '8px 22px', borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAddDialogOpen(false)}
                                    style={{ padding: '8px 22px', borderRadius: 6, background: '#aaa', color: '#fff', border: 'none', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
            <div style={{
                minHeight: '100vh',
                background: '#f5f5f5',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingTop: 40,
                paddingBottom: 40
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: 700,
                    background: '#fafafa',
                    borderRadius: 12,
                    boxShadow: '0 2px 12px #e0e0e0',
                    padding: 32,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <h1 style={{
                        textAlign: 'center',
                        marginBottom: 8, // reduced from 32 to 8
                        width: '100%',
                        fontSize: 28,
                        fontWeight: 700,
                        letterSpacing: 1
                    }}>Book Management</h1>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 8, // reduced from 28 to 8
                        gap: 16,
                        width: '100%',
                        justifyContent: 'center'
                    }}>
                        <input
                            type="text"
                            placeholder="Search by title or author"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                flex: 1,
                                minWidth: 0,
                                padding: 10,
                                borderRadius: 6,
                                border: '1px solid #ccc',
                                maxWidth: 350,
                                background: '#fff',
                                color: '#000',
                                fontSize: 16
                            }}
                        />
                        <button
                            onClick={() => setIsAddDialogOpen(true)}
                            style={{
                                padding: '10px 28px',
                                borderRadius: 6,
                                background: '#1976d2',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: 16,
                                boxShadow: '0 1px 4px #1976d222'
                            }}
                        >
                            Add Book
                        </button>
                    </div>
                    <div style={{
                        background: '#fff',
                        borderRadius: 8,
                        boxShadow: '0 1px 6px #eee',
                        padding: 20,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <h2 style={{
                            marginBottom: 18,
                            textAlign: 'center',
                            width: '100%',
                            fontSize: 20,
                            fontWeight: 600
                        }}>Book List</h2>
                        <div style={{ width: '100%', overflowX: 'auto' }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                textAlign: 'center',
                                minWidth: 400
                            }}>
                                <thead>
                                    <tr style={{ background: '#f0f0f0' }}>
                                        <th style={{
                                            padding: 10,
                                            borderBottom: '1px solid #ddd',
                                            textAlign: 'center',
                                            fontWeight: 600,
                                            fontSize: 15
                                        }}>Title</th>
                                        <th style={{
                                            padding: 10,
                                            borderBottom: '1px solid #ddd',
                                            textAlign: 'center',
                                            fontWeight: 600,
                                            fontSize: 15
                                        }}>Author</th>
                                        <th style={{
                                            padding: 10,
                                            borderBottom: '1px solid #ddd',
                                            textAlign: 'center',
                                            fontWeight: 600,
                                            fontSize: 15
                                        }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBooks.map((book) => (
                                        <tr
                                            key={book.id}
                                            style={editingBook && editingBook.id === book.id ? { background: '#e3f2fd' } : {}}
                                        >
                                            <td style={{
                                                padding: 10,
                                                borderBottom: '1px solid #eee',
                                                textAlign: 'center',
                                                color: '#000'
                                            }}>
                                                {editingBook && editingBook.id === book.id ? (
                                                    <input
                                                        type="text"
                                                        value={editingBook.title}
                                                        placeholder={originalBook?.title || ''}
                                                        onChange={e =>
                                                            setEditingBook({ ...editingBook, title: e.target.value })
                                                        }
                                                        style={{
                                                            width: '90%',
                                                            padding: 6,
                                                            borderRadius: 4,
                                                            border: '1px solid #ccc',
                                                            background: '#fff',
                                                            color: '#000',
                                                            fontSize: 15
                                                        }}
                                                    />
                                                ) : (
                                                    <strong>{book.title}</strong>
                                                )}
                                            </td>
                                            <td style={{
                                                padding: 10,
                                                borderBottom: '1px solid #eee',
                                                textAlign: 'center',
                                                color: '#000'
                                            }}>
                                                {editingBook && editingBook.id === book.id ? (
                                                    <input
                                                        type="text"
                                                        value={editingBook.author}
                                                        placeholder={originalBook?.author || ''}
                                                        onChange={e =>
                                                            setEditingBook({ ...editingBook, author: e.target.value })
                                                        }
                                                        style={{
                                                            width: '90%',
                                                            padding: 6,
                                                            borderRadius: 4,
                                                            border: '1px solid #ccc',
                                                            background: '#fff',
                                                            color: '#000',
                                                            fontSize: 15
                                                        }}
                                                    />
                                                ) : (
                                                    book.author
                                                )}
                                            </td>
                                            <td style={{
                                                padding: 10,
                                                borderBottom: '1px solid #eee',
                                                textAlign: 'center'
                                            }}>
                                                {editingBook && editingBook.id === book.id ? (
                                                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                                                        <button
                                                            onClick={handleSave}
                                                            style={{
                                                                padding: '6px 16px',
                                                                borderRadius: 4,
                                                                background: '#1976d2',
                                                                color: '#fff',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                fontWeight: 500,
                                                                fontSize: 15
                                                            }}
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            style={{
                                                                padding: '6px 16px',
                                                                borderRadius: 4,
                                                                background: '#aaa',
                                                                color: '#fff',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                fontWeight: 500,
                                                                fontSize: 15
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                                                        <button
                                                            onClick={() => handleEditBook(book)}
                                                            style={{
                                                                padding: '6px 16px',
                                                                borderRadius: 4,
                                                                background: '#0288d1',
                                                                color: '#fff',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                fontWeight: 500,
                                                                fontSize: 15
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteBook(book.id)}
                                                            style={{
                                                                padding: '6px 16px',
                                                                borderRadius: 4,
                                                                background: '#d32f2f',
                                                                color: '#fff',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                fontWeight: 500,
                                                                fontSize: 15
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredBooks.length === 0 && (
                                        <tr>
                                            <td colSpan={3} style={{
                                                textAlign: 'center',
                                                padding: 20,
                                                color: '#888',
                                                fontSize: 16
                                            }}>
                                                No books found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookManage;
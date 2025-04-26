import React, { useEffect, useState } from "react";
import { getAllBooks } from "../Services/ApiService";

const BooksList = () => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await getAllBooks();
                setBooks(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchBooks();
    }, []);

    if (error) return <p>{error}</p>;

    return (
        <ul>
            {books.map((book) => (
                <li key={book.id}>{book.title}</li>
            ))}
        </ul>
    );
};

export default BooksList;

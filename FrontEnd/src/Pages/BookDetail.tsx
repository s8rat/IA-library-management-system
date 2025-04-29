import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Book } from '../types/book';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5205';

export const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState<Book | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axios.get(`/api/Books/${id}`);
                setBook(response.data);
                setError(null); // Clear any previous errors
            } catch (err) {
                console.error('Error fetching book:', err);
                const errorMessage = axios.isAxiosError(err) && err.response?.data?.message
                    ? err.response.data.message
                    : 'Failed to fetch book details. Please try again later.';
                setError(errorMessage);
            }
        };
        fetchBook();
    }, [id]);

    if (error) {
        return (
            <div className="text-center p-8 text-red-500 text-xl">
                {error}
            </div>
        );
    }

    if (!book) {
        return (
            <div className="text-center p-8 text-gray-600 text-xl">
                Book not found
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 bg-white rounded-xl p-8 shadow-md">
                <div className="relative">
                    <img 
                        src={book.coverImage ? `data:${book.coverImageContentType};base64,${book.coverImage}` : '/default-book-cover.jpg'} 
                        alt={book.title}
                        className="w-full h-auto rounded-lg shadow-lg"
                    />
                    {!book.available && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-md text-sm">
                            Unavailable
                        </div>
                    )}
                </div>
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-gray-800">{book.title}</h1>
                    <h2 className="text-xl text-gray-600">by {book.author}</h2>
                    <button 
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                            book.available 
                                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                : 'bg-gray-400 cursor-not-allowed text-white'
                        }`}
                        disabled={!book.available}
                    >
                        {book.available ? 'Borrow Now' : 'Currently Unavailable'}
                    </button>
                </div>
            </div>
        </div>
    );
};
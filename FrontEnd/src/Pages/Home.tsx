import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BookCard } from "../components/Book/BookCard";
import { Book } from "../types/book";
import api from "../Services/api";

export const Home = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // Define services array with proper syntax
    const services = [
        {
            id: "service-1",
            icon: "📚",
            title: "Book Lending",
            description: "Borrow physical books from our extensive collection",
        },
        {
            id: "service-2",
            icon: "📱",
            title: "E-Books",
            description: "Access digital books anytime, anywhere",
        },
        {
            id: "service-3",
            icon: "👥",
            title: "Community",
            description: "Join our reading community and share your thoughts",
        },
    ];

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await api.get("/api/Books");
                setBooks(response.data);
            } catch (error) {
                console.error("Error fetching books:", error);
                setError("Failed to fetch books. Please try again later.");
            }
        };
        fetchBooks();
    }, []);

    // Sort books alphabetically by title, with a fallback for undefined titles
    const sortedBooks = [...books].sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
    );

    return (
        <div className="w-full min-h-screen bg-gray-50 justify-items-center">
            {/* Hero Section */}
            <section className="px-60 bg-gradient-to-br w-full h-screen">
                <div className="h-screen flex flex-col lg:flex-row items-center justify-between gap-8 mx-auto text-center lg:text-left">
                    <div className="w-full lg:w-2/3 space-y-6">
                        <h1 className="text-8xl font-halimum font-bold text-gray-800 leading-tight mb-16">
                            Where Your Book Journey Begins
                        </h1>
                        <p className="text-2xl text-gray-600 text-poppins">
                            Step into a world of endless stories, wisdom, and imagination. <br /> Let every page be a new adventure.
                        </p>
                        <div className="flex justify-center lg:justify-start">
                            <Link
                                to="/explore"
                                className="inline-block font-bold bg-secondary hover:bg-blue-700 text-white px-8 py-3 rounded-md transition-all text-lg"
                            >
                                Explore Books
                            </Link>
                        </div>
                    </div>
                    <div className="w-full h-full lg:w-1/3 flex justify-center items-center">
                        <div className="overflow-hidden rounded-full aspect-square flex items-center justify-center shadow-lg">
                            <img src="/Image/header-image.jpg" alt="logo" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
                        Our Services
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="bg-gray-50 p-8 rounded-lg text-center shadow-md hover:shadow-xl hover:scale-105 transition-all w-full max-w-sm"
                            >
                                <div className="text-5xl text-blue-600 mb-4">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Books Section */}
            <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-white to-blue-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-extrabold mb-14 text-center text-blue-900 tracking-tight drop-shadow">
                        Popular Books
                    </h2>
                    {error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
                            {sortedBooks.slice(0, 6).map((book) => (
                                <BookCard book={book} key={book.id} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Join Club Section */}
            <section className="px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-8 sm:p-12 text-center shadow-lg">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                        Join Our Reading Community Today
                    </h2>
                    <p className="text-lg mb-8 max-w-2xl mx-auto">
                        Become a member and enjoy exclusive benefits and access
                        to our entire collection.
                    </p>
                    <Link
                        to="/register"
                        className="inline-block bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-all text-lg"
                    >
                        Join Now
                    </Link>
                </div>
            </section>
            {token && (
                <button
                    onClick={() => navigate("/chat")}
                    className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-5 flex items-center justify-center transition-all duration-300 group"
                    title="Open Community Chat"
                >
                    <span className="text-2xl">💬</span>
                    <span className="ml-2 opacity-100 group-hover:opacity-200 transition-opacity text-base font-semibold">
                        Chat
                    </span>
                </button>
            )}
        </div>
    );
};

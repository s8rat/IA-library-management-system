import { useState } from 'react';
import { Link } from 'react-router-dom';
import { books } from '../data/books';

export const ExploreBooks = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');

    // Get unique genres from all books
    const allGenres = ['All', ...new Set(books.flatMap(book => book.genre))];

    // Filter books based on search term and genre
    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            book.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = selectedGenre === 'All' || book.genre.includes(selectedGenre);
        return matchesSearch && matchesGenre;
    });

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">
                    Explore Our Collection
                </h1>
                <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
                    <input
                        type="text"
                        placeholder="Search by title or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-w-md w-full"
                    />
                    <select
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-w-md w-full"
                    >
                        {allGenres.map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                    <div 
                        key={book.id} 
                        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                    >
                        <div className="relative aspect-[2/3]">
                            <img 
                                src={book.cover} 
                                alt={book.title}
                                className="w-full h-full object-cover"
                            />
                            {!book.available && (
                                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-md text-sm">
                                    Unavailable
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{book.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{book.author}</p>
                            <div className="flex gap-4 text-sm mb-3">
                                <span className="text-yellow-500">★ {book.rating}</span>
                                <span className="text-gray-500">{book.language}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {book.genre.map((g, index) => (
                                    <span 
                                        key={index} 
                                        className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs"
                                    >
                                        {g}
                                    </span>
                                ))}
                            </div>
                            <Link 
                                to={`/book/${book.id}`}
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 
import { useParams } from 'react-router-dom';
import { books } from '../data/books';

export const BookDetail = () => {
    const { id } = useParams();
    const book = books.find(b => b.id === id);

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
                        src={book.cover} 
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
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="text-yellow-500">★ {book.rating}</span>
                        <span>{book.language}</span>
                        <span>{book.pages} pages</span>
                        <span>{book.publishYear}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {book.genre.map((g, index) => (
                            <span 
                                key={index} 
                                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs"
                            >
                                {g}
                            </span>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-800">Description</h3>
                        <p className="text-gray-600 leading-relaxed">{book.description}</p>
                    </div>
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
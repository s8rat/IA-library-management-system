import React, { useState, useEffect } from 'react';
import { Book } from '../../types/book';
import { BookCard } from './BookCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface BookSliderProps {
  books: Book[];
  title?: string;
  className?: string;
}

const BookSlider: React.FC<BookSliderProps> = ({ books, title = "Featured Books", className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleBooks, setVisibleBooks] = useState<Book[]>([]);
  const booksPerPage = 4;

  useEffect(() => {
    updateVisibleBooks();
  }, [books, currentIndex]);

  const updateVisibleBooks = () => {
    const start = currentIndex;
    const end = Math.min(start + booksPerPage, books.length);
    const visible = books.slice(start, end);
    setVisibleBooks(visible);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - booksPerPage + books.length) % books.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + booksPerPage) % books.length);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            disabled={currentIndex === 0}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-gray-600" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            disabled={currentIndex + booksPerPage >= books.length}
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BookSlider; 
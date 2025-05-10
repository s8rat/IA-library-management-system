import React from 'react';
import BorrowedBooks from './BorrowedBooks';

interface BorrowHistory {
    id: number;
    bookTitle: string;
    author: string;
    borrowDate: string;
    dueDate: string;
    status: string;
    returnDate: string | null;
}

interface BorrowHistorySectionProps {
    borrowHistory: BorrowHistory[];
    isLoading: boolean;
}

const BorrowHistorySection: React.FC<BorrowHistorySectionProps> = ({ borrowHistory, isLoading }) => {
    return (
        <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Borrow History
                </h2>
                <div className="overflow-x-auto">
                    <BorrowedBooks 
                        books={borrowHistory}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default BorrowHistorySection; 
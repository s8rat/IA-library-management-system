import React, { useState } from 'react';

const UserProfile: React.FC = () => {
    const user = {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        role: 'Member',
        joinedDate: '2023-01-15',
    };

    // Example favorite books data
    const favoriteBooks = [
        {
            id: 1,
            bookTitle: 'The Hobbit',
            author: 'J.R.R. Tolkien',
            year: 1937,
        },
        {
            id: 2,
            bookTitle: 'Pride and Prejudice',
            author: 'Jane Austen',
            year: 1813,
        },
        {
            id: 3,
            bookTitle: 'The Catcher in the Rye',
            author: 'J.D. Salinger',
            year: 1951,
        },
    ];

    // Example borrow request history data
    const borrowHistory = [
        {
            id: 1,
            bookTitle: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            requestDate: '2024-04-01',
            status: 'Approved',
            returnDate: '2024-04-15',
        },
        {
            id: 2,
            bookTitle: '1984',
            author: 'George Orwell',
            requestDate: '2024-03-10',
            status: 'Returned',
            returnDate: '2024-03-24',
        },
        {
            id: 3,
            bookTitle: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            requestDate: '2024-02-20',
            status: 'Rejected',
            returnDate: '-',
        },
    ];

    // Request to be librarian state
    const [requestMsg, setRequestMsg] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleRequest = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // Here you would send the request to the backend
    };

    return (
        <div className="bg-[#d3dde3] min-h-screen py-10 px-2">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-8">
                    {/* User Profile Card */}
                    <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200 text-gray-900 flex flex-col justify-between">
                        <div>
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-800 mb-2">
                                    {user.name.split(' ').map((n) => n[0]).join('')}
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                <span className="text-gray-600 text-sm">{user.role}</span>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <span className="font-semibold text-gray-800">Email: </span>
                                    <span className="text-gray-900">{user.email}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-800">Joined Date: </span>
                                    <span className="text-gray-900">{new Date(user.joinedDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Favorite Books Table Card */}
                    <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200 text-gray-900 flex flex-col">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900">Favorite Books</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm bg-white border border-gray-200 rounded-lg text-gray-900">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-800">
                                        <th className="py-2 px-3">Book Title</th>
                                        <th className="py-2 px-3">Author</th>
                                        <th className="py-2 px-3">Year</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {favoriteBooks.map((book) => (
                                        <tr key={book.id} className="border-t last:border-b-0">
                                            <td className="py-2 px-3">{book.bookTitle}</td>
                                            <td className="py-2 px-3">{book.author}</td>
                                            <td className="py-2 px-3">{book.year}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-8">
                    {/* Request to be Librarian Card */}
                    <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200 text-gray-900 flex flex-col">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900">Request to Become a Librarian</h2>
                        {submitted ? (
                            <div className="text-green-700 bg-green-100 px-4 py-2 rounded">
                                Your request has been submitted!
                            </div>
                        ) : (
                            <form onSubmit={handleRequest} className="flex flex-col gap-4">
                                <label className="font-semibold text-gray-800">
                                    Why do you want to be a librarian?
                                    <textarea
                                        className="mt-2 border border-gray-300 rounded p-2 w-full"
                                        rows={4}
                                        value={requestMsg}
                                        onChange={e => setRequestMsg(e.target.value)}
                                        required
                                    />
                                </label>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
                                >
                                    Submit Request
                                </button>
                            </form>
                        )}
                    </div>
                    {/* Borrow Request History Table Card */}
                    <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200 text-gray-900 flex flex-col">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900">Borrow Request History</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm bg-white border border-gray-200 rounded-lg text-gray-900">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-800">
                                        <th className="py-2 px-3">Book Title</th>
                                        <th className="py-2 px-3">Author</th>
                                        <th className="py-2 px-3">Request Date</th>
                                        <th className="py-2 px-3">Status</th>
                                        <th className="py-2 px-3">Return Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {borrowHistory.map((req) => (
                                        <tr key={req.id} className="border-t last:border-b-0">
                                            <td className="py-2 px-3">{req.bookTitle}</td>
                                            <td className="py-2 px-3">{req.author}</td>
                                            <td className="py-2 px-3">{new Date(req.requestDate).toLocaleDateString()}</td>
                                            <td className="py-2 px-3">
                                                <span
                                                    className={
                                                        req.status === 'Approved'
                                                            ? 'bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs'
                                                            : req.status === 'Returned'
                                                            ? 'bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs'
                                                            : 'bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs'
                                                    }
                                                >
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="py-2 px-3">
                                                {req.returnDate !== '-' ? new Date(req.returnDate).toLocaleDateString() : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
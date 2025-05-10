import React, { useState, useEffect } from 'react';
import api from '../../Services/api';

interface ReturnRequest {
    id: number;
    bookId: number;
    bookTitle: string;
    author: string;
    userId: number;
    username: string;
    borrowDate: string;
    dueDate: string;
    returnDate: string;
    status: string;
}

interface ApiError {
    response?: {
        data: {
            message?: string;
        };
    };
}

const SeeReturnRequest: React.FC = () => {
    const [requests, setRequests] = useState<ReturnRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [processingReturn, setProcessingReturn] = useState<number | null>(null);

    useEffect(() => {
        fetchRequests();
    }, [statusFilter]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/Borrow/records${statusFilter ? `?status=${statusFilter}` : ''}`);
            setRequests(response.data);
            setError(null);
        } catch (err: unknown) {
            const apiError = err as ApiError;
            setError(apiError.response?.data?.message || 'Failed to fetch return requests');
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (recordId: number) => {
        if (!window.confirm('Are you sure you want to process this book return?')) {
            return;
        }

        try {
            setProcessingReturn(recordId);
            setError(null);
            setSuccess(null);
            
            await api.post(`/api/Borrow/return/${recordId}`);
            setSuccess('Book return processed successfully');
            
            // Refresh the requests list
            await fetchRequests();
        } catch (err: unknown) {
            const apiError = err as ApiError;
            setError(apiError.response?.data?.message || 'Failed to process return');
        } finally {
            setProcessingReturn(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Book Returns</h2>
                <div className="flex gap-4">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Records</option>
                        <option value="Active">Active</option>
                        <option value="Returned">Returned</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                    <button
                        onClick={fetchRequests}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {success}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Book
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Borrowed By
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Borrow Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Due Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                    No return requests found
                                </td>
                            </tr>
                        ) : (
                            requests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{request.bookTitle}</div>
                                        <div className="text-sm text-gray-500">{request.author}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{request.username}</div>
                                        <div className="text-sm text-gray-500">ID: {request.userId}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(request.borrowDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(request.dueDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            request.status === 'Returned' 
                                                ? 'bg-green-100 text-green-800'
                                                : request.status === 'Overdue'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {request.status === 'Active' && (
                                            <button
                                                onClick={() => handleReturn(request.id)}
                                                disabled={processingReturn === request.id}
                                                className={`text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-md transition-colors ${
                                                    processingReturn === request.id ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                            >
                                                {processingReturn === request.id ? (
                                                    <span className="flex items-center">
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Processing...
                                                    </span>
                                                ) : (
                                                    'Accept Return'
                                                )}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SeeReturnRequest;

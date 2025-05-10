import React, { useState } from 'react';
import api from '../../Services/api';

interface LibrarianRequestSectionProps {
    userRole: string;
}

const LibrarianRequestSection: React.FC<LibrarianRequestSectionProps> = ({ userRole }) => {
    const [requestMsg, setRequestMsg] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found');
                return;
            }

            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            await api.post('/api/Auth/request-librarian', {
                message: requestMsg,
                currentRole: tokenPayload.role
            });
            setSubmitted(true);
            setError(null);
        } catch (err) {
            console.error('Error submitting request:', err);
            setError('Failed to submit request. Please try again later.');
        }
    };

    if (userRole !== 'User') {
        return null;
    }

    return (
        <div className="mt-8">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Request to Become a Librarian
                </h2>
                {submitted ? (
                    <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Your request has been submitted successfully!
                    </div>
                ) : (
                    <form onSubmit={handleRequest} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Why do you want to be a librarian?
                            </label>
                            <textarea
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                                rows={4}
                                value={requestMsg}
                                onChange={e => setRequestMsg(e.target.value)}
                                required
                                placeholder="Please explain why you want to become a librarian..."
                            />
                        </div>
                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            Submit Request
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LibrarianRequestSection; 
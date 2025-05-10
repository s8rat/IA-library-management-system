import React, { useState } from 'react';
import api from '../../Services/api';

interface LibrarianRequestSectionProps {
    userRole: string;
}

const LibrarianRequestSection: React.FC<LibrarianRequestSectionProps> = ({ userRole }) => {
    const [requestMsg, setRequestMsg] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
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
        } finally {
            setIsSubmitting(false);
        }
    };

    if (userRole !== 'User') {
        return null;
    }

    return (
        <div className="relative transform transition-all duration-300 hover:scale-[1.01]">
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg mr-4">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Become a Librarian</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Join our team and help manage the library
                            </p>
                        </div>
                    </div>
                </div>

                {submitted ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-green-800">Request Submitted!</h3>
                                <p className="mt-1 text-sm text-green-600">
                                    Thank you for your interest. We'll review your request and get back to you soon.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleRequest} className="space-y-6">
                        <div className="bg-gray-50 rounded-xl p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Why do you want to be a librarian?
                            </label>
                            <textarea
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200"
                                rows={4}
                                value={requestMsg}
                                onChange={e => setRequestMsg(e.target.value)}
                                required
                                placeholder="Share your passion for books and why you'd be a great addition to our team..."
                            />
                            {error && (
                                <div className="mt-2 text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full flex items-center justify-center px-6 py-3 rounded-xl text-white font-medium
                                ${isSubmitting 
                                    ? 'bg-purple-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                                } transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                'Submit Request'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LibrarianRequestSection;
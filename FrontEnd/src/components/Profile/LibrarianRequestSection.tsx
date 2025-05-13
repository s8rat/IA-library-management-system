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

            await api.post('/api/Auth/request-librarian', {
                RequestMessage: requestMsg
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
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg text-black font-semibold mb-4">Request Librarian Role</h3>
            {submitted ? (
                <div className="text-green-600">
                    Your request has been submitted successfully. We will review it and get back to you soon.
                </div>
            ) : (
                <form onSubmit={handleRequest}>
                    <div className="mb-4">
                        <label htmlFor="requestMsg" className="block text-sm font-medium text-black mb-2">
                            Why do you want to become a librarian?
                        </label>
                        <textarea
                            id="requestMsg"
                            value={requestMsg}
                            onChange={(e) => setRequestMsg(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            required
                            placeholder="Please explain why you want to become a librarian..."
                        />
                    </div>
                    {error && (
                        <div className="text-red-600 text-black mb-4">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default LibrarianRequestSection;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Services/api';
import ProfileForm from '../Components/Profile/ProfileForm';
import BorrowedBooks from '../Components/Profile/BorrowedBooks';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    ssn: string;
    createdAt: string;
}

interface BorrowHistory {
    id: number;
    bookTitle: string;
    author: string;
    requestDate: string;
    status: string;
    returnDate: string;
}

interface ApiError {
    response?: {
        data: {
            details?: string;
            message?: string;
            errors?: Record<string, string[]>;
            type?: string;
            title?: string;
            status?: number;
            traceId?: string;
        };
        status: number;
        headers: Record<string, string>;
    };
    message?: string;
}

const UserProfile: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<Partial<User>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [borrowHistory, setBorrowHistory] = useState<BorrowHistory[]>([]);
    const [requestMsg, setRequestMsg] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');
                
                console.log('Token:', token ? 'Present' : 'Missing');
                console.log('User ID:', userId);

                if (!token) {
                    console.log('No token found, redirecting to login');
                    navigate('/auth/login');
                    return;
                }

                // Fetch current user's profile
                console.log('Fetching user profile...');
                const response = await api.get('/api/Users/profile');
                console.log('Profile response:', response.data);
                
                if (!response.data) {
                    throw new Error('No user data received');
                }

                setUser(response.data);
                setEditedUser(response.data);
                
                // Fetch borrow history
                try {
                    console.log('Fetching borrow history...');
                    const historyResponse = await api.get('/api/Borrows/my-records');
                    console.log('Borrow history response:', historyResponse.data);
                    setBorrowHistory(historyResponse.data);
                } catch (err) {
                    console.error('Error fetching borrow history:', err);
                    setBorrowHistory([]);
                }
            } catch (err: unknown) {
                console.error('Error fetching user data:', err);
                const apiError = err as ApiError;
                if (apiError.response) {
                    console.error('Response error:', apiError.response.data);
                    console.error('Status:', apiError.response.status);
                    console.error('Headers:', apiError.response.headers);
                    setError(apiError.response.data.details || apiError.response.data.message || 'Failed to load user data. Please try again later.');
                } else {
                    setError('Failed to load user data. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleEdit = () => {
        setEditedUser({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            username: user?.username || '',
            email: user?.email || '',
            phoneNumber: user?.phoneNumber || ''
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            if (!user) {
                setError('User data not found');
                return;
            }

            const updateData = {
                Username: editedUser.username?.trim(),
                Email: editedUser.email?.trim(),
                FirstName: editedUser.firstName?.trim(),
                LastName: editedUser.lastName?.trim(),
                PhoneNumber: editedUser.phoneNumber?.trim(),
                Role: user.role 
            };

            // Validate required fields
            if (!updateData.Username || !updateData.Email || !updateData.FirstName || !updateData.LastName) {
                setError('Please fill in all required fields');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(updateData.Email)) {
                setError('Please enter a valid email address');
                return;
            }

            // Validate role
            if (!['Admin', 'Librarian', 'User'].includes(updateData.Role)) {
                setError('Invalid role specified');
                return;
            }

            console.log('Updating user with data:', updateData);
            const response = await api.put(`/api/Users/${user.id}`, updateData);
            console.log('Update response:', response.data);
            
            setUser(response.data);
            setIsEditing(false);
            setError(null);
        } catch (error: unknown) {
            console.error('Error updating user:', error);
            const apiError = error as ApiError;
            if (apiError.response) {
                console.error('Response error:', apiError.response.data);
                if (apiError.response.data.errors) {
                    // Handle validation errors
                    const errorMessages = Object.values(apiError.response.data.errors).flat();
                    setError(errorMessages.join(', '));
                } else {
                    setError(apiError.response.data.message || 'Failed to update user data. Please try again later.');
                }
            } else {
                setError('Failed to update user data. Please try again later.');
            }
        }
    };

    const handleCancel = () => {
        setEditedUser({});
        setIsEditing(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found');
                return;
            }

            // Decode the JWT token to get the role
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            const currentRole = tokenPayload.role;

            await api.post('/api/Auth/request-librarian', {
                message: requestMsg,
                currentRole: currentRole
            });
            setSubmitted(true);
        } catch (err) {
            console.error('Error submitting request:', err);
            setError('Failed to submit request. Please try again later.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <div className="text-red-500 text-center">{error || 'User not found'}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Profile */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <span className="text-4xl font-bold text-white">
                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                    {user.firstName} {user.lastName}
                                </h2>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    {user.role}
                                </span>
                            </div>

                            <ProfileForm
                                user={user}
                                isEditing={isEditing}
                                editedUser={editedUser}
                                onInputChange={handleInputChange}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                onEdit={handleEdit}
                            />
                        </div>
                    </div>

                    {/* Right Column - Borrow History */}
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
                                    books={borrowHistory.map(book => ({
                                        id: book.id,
                                        title: book.bookTitle,
                                        author: book.author,
                                        borrowDate: book.requestDate,
                                        dueDate: book.returnDate,
                                        status: book.status
                                    }))}
                                    isLoading={loading}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Request to be Librarian Card - Full Width */}
                {user.role === 'User' && (
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
                )}
            </div>
        </div>
    );
};

export default UserProfile;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Services/api';
import UserAvatar from '../../Components/Profile/UserAvatar';
import ProfileForm from '../../Components/Profile/ProfileForm';
import BorrowedBooks from '../../Components/Profile/BorrowedBooks';

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
                id: user.id,
                username: editedUser.username?.trim(),
                email: editedUser.email?.trim(),
                firstName: editedUser.firstName?.trim(),
                lastName: editedUser.lastName?.trim(),
                phoneNumber: editedUser.phoneNumber?.trim(),
                ssn: user.ssn,
                role: user.role,
                createdAt: user.createdAt
            };

            // Validate required fields
            if (!updateData.username || !updateData.email || !updateData.firstName || !updateData.lastName) {
                setError('Please fill in all required fields');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(updateData.email)) {
                setError('Please enter a valid email address');
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
            await api.post('/api/Auth/request-librarian');
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
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Profile Card */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                                <span className="text-3xl font-bold text-blue-600">
                                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {user.firstName} {user.lastName}
                            </h2>
                            <p className="text-gray-500">{user.role}</p>
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

                    {/* Borrow History Card */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Borrow History</h2>
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

                    {/* Request to be Librarian Card */}
                    {user.role === 'User' && (
                        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Request to Become a Librarian</h2>
                            {submitted ? (
                                <div className="bg-green-50 text-green-800 p-4 rounded-md">
                                    Your request has been submitted successfully!
                                </div>
                            ) : (
                                <form onSubmit={handleRequest} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Why do you want to be a librarian?
                                        </label>
                                        <textarea
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            rows={4}
                                            value={requestMsg}
                                            onChange={e => setRequestMsg(e.target.value)}
                                            required
                                            placeholder="Please explain why you want to become a librarian..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                                    >
                                        Submit Request
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Services/api';
import ProfileForm from '../Components/Profile/ProfileForm';
import BorrowHistorySection from '../Components/Profile/BorrowHistorySection';
import LibrarianRequestSection from '../Components/Profile/LibrarianRequestSection';
import UserAvatar from '../Components/Profile/UserAvatar';

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
    borrowDate: string;
    dueDate: string;
    status: string;
    returnDate: string | null;
}

interface ApiError {
    response?: {
        data: {
            message?: string;
            errors?: Record<string, string[]>;
        };
        status: number;
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

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/auth/login');
                    return;
                }

                const response = await api.get('/api/Users/profile');
                if (!response.data) {
                    throw new Error('No user data received');
                }

                setUser(response.data);
                setEditedUser(response.data);
                
                try {
                    const historyResponse = await api.get('/api/Borrow/my-records');
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
                    setError(apiError.response.data.message || 'Failed to load user data. Please try again later.');
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
                PhoneNumber: editedUser.phoneNumber?.trim() || "",
                Role: user.role
            };

            if (!updateData.Username || !updateData.Email || !updateData.FirstName || !updateData.LastName) {
                setError('Please fill in all required fields');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(updateData.Email)) {
                setError('Please enter a valid email address');
                return;
            }

            const response = await api.put(`/api/Users/${user.id}`, updateData);
            setUser(response.data);
            setIsEditing(false);
            setError(null);
        } catch (error: unknown) {
            console.error('Error updating user:', error);
            const apiError = error as ApiError;
            if (apiError.response?.data.errors) {
                const errorMessages = Object.values(apiError.response.data.errors).flat();
                setError(errorMessages.join(', '));
            } else {
                setError(apiError.response?.data.message || 'Failed to update user data. Please try again later.');
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
                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
                            <UserAvatar 
                                firstName={user.firstName}
                                lastName={user.lastName}
                                role={user.role}
                            />
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

                    <BorrowHistorySection 
                        borrowHistory={borrowHistory}
                        isLoading={loading}
                    />
                </div>

                <LibrarianRequestSection userRole={user.role} />
            </div>
        </div>
    );
};

export default UserProfile;
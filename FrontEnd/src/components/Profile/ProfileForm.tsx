import React from 'react';

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

interface ProfileFormProps {
    user: User;
    isEditing: boolean;
    editedUser: Partial<User>;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
    onCancel: () => void;
    onEdit: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
    user,
    isEditing,
    editedUser,
    onInputChange,
    onSave,
    onCancel,
    onEdit
}) => {
    return (
        <div className="space-y-6">
            {isEditing ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={editedUser.firstName || ''}
                                onChange={onInputChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={editedUser.lastName || ''}
                                onChange={onInputChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={editedUser.username || ''}
                            onChange={onInputChange}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={editedUser.email || ''}
                            onChange={onInputChange}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={editedUser.phoneNumber || ''}
                            onChange={onInputChange}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onSave}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                First Name
                            </label>
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{user.firstName}</p>
                        </div>
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                Last Name
                            </label>
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{user.lastName}</p>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Username
                        </label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{user.username}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Email
                        </label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{user.email}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Phone Number
                        </label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{user.phoneNumber || 'Not provided'}</p>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={onEdit}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileForm; 
import React from 'react';

interface UserAvatarProps {
    firstName: string;
    lastName: string;
    role: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ firstName, lastName, role }) => {
    return (
        <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg">
                {firstName[0]}{lastName[0]}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{firstName} {lastName}</h1>
            <span className="text-sm text-gray-500">{role}</span>
        </div>
    );
};

export default UserAvatar; 
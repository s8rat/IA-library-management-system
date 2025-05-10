import React from 'react';

interface UserAvatarProps {
    firstName: string;
    lastName: string;
    role: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ firstName, lastName, role }) => {
    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'librarian':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-green-100 text-green-800 border-green-200';
        }
    };

    return (
        <div className="flex flex-col items-center mb-8">
            <div className="relative group">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                    {firstName[0]}{lastName[0]}
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(role)}`}>
                        {role}
                    </span>
                </div>
            </div>
            <h1 className="mt-6 text-2xl font-bold text-gray-900">{firstName} {lastName}</h1>
            <div className="w-16 h-1 bg-blue-500 rounded-full mt-4 mb-2"></div>
        </div>
    );
};

export default UserAvatar;
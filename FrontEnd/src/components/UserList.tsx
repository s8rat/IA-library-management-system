import React from "react";

interface User {
  id: number;
  username: string;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  ssn: string;
  createdAt: string;
}

interface UserListProps {
  users: User[];
  editingUser: User | null;
  setEditingUser: (user: User | null) => void;
  setOriginalUser: (user: User | null) => void;
  handleSaveUser: () => void;
  handleCancelEdit: () => void;
  handleEditUser: (user: User) => void;
  handleDeleteUser: (id: number) => void;
}

const UserList: React.FC<UserListProps> = ({
  users,
  editingUser,
  setEditingUser,
  handleSaveUser,
  handleCancelEdit,
  handleEditUser,
  handleDeleteUser,
}) => (
  <div className="space-y-4">
    {users.map((user) => (
      <div
        key={user.id}
        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
      >
        {editingUser && editingUser.id === user.id ? (
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveUser();
            }}
          >
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editingUser.firstName}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, firstName: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editingUser.lastName}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, lastName: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={editingUser.role}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, role: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              >
                <option value="User">User</option>
                <option value="Librarian">Librarian</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={editingUser.phoneNumber ?? ""}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    phoneNumber: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div className="flex items-end space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-800">
                  Username:
                </span>
                <span className="font-medium text-gray-900">
                  {user.username}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-800">Name:</span>
                <span className="text-gray-900">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-800">
                  Email:
                </span>
                <span className="text-gray-900">{user.email}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-800">Role:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === "Admin"
                      ? "bg-purple-100 text-purple-900"
                      : user.role === "Librarian"
                      ? "bg-blue-100 text-blue-900"
                      : "bg-green-100 text-green-900"
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-800">
                  Phone:
                </span>
                <span className="text-gray-900">
                  {user.phoneNumber || "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-800">
                  Created:
                </span>
                <span className="text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="col-span-2 flex justify-end space-x-2">
              <button
                onClick={() => handleEditUser(user)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
);

export default UserList;

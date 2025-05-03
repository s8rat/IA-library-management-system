import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  faUser,
  faBook,
  faCrown,
  faSignIn,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../Components/Sidebar";
import SearchBar from "../Components/SearchBar";
import ViewBoardCard from "../Components/ViewBoardCard";
import api from "../Services/api";
import { Book } from "../types/book";

const sidebarItems = [
  { key: "users", icon: faUser, label: "Manage Users" },
  { key: "books", icon: faBook, label: "Manage Books" },
  { key: "req", icon: faSignIn, label: "Registration Requests" },
  { key: "memberships", icon: faCrown, label: "Manage Membership plans" },
];

interface User {
  id: string;
  username: string;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  ssn: string;
  createdAt: string;
}

interface Membership {
  id: string;
  membershipType: string;
  borrowLimit: number;
  durationInDays: number;
  price?: number;
  description?: string;
  isFamilyPlan: boolean;
  maxFamilyMembers?: number;
  requiresApproval: boolean;
}

const dummyRequests = [
  { id: "1", status: "Pending", name: "Request from Alice" },
  { id: "2", status: "Pending", name: "Request from Bob" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState<User & { password: string }>({
    id: "",
    username: "",
    role: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    ssn: "",
    createdAt: new Date().toISOString(),
  });
  const [addUserError, setAddUserError] = useState<string | null>(null);

  // Check authentication and role
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    
    if (!token || role !== 'Admin') {
      navigate('/auth/login');
      return;
    }

    // Load data based on active tab
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;
        switch (activeTab) {
          case 'users':
            response = await api.get('/api/Users');
            setUsers(response.data);
            break;
          case 'books':
            response = await api.get('/api/Books');
            setBooks(response.data);
            break;
          case 'memberships':
            response = await api.get('/api/Membership');
            setMemberships(response.data);
            break;
        }
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab, navigate]);

  // User actions
  const handleEditUser = (user: User) => {
    setEditingUser({ ...user });
    setOriginalUser({ ...user });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setOriginalUser(null);
  };

  const handleSaveUser = () => {
    if (editingUser && originalUser) {
      api
        .put(`/api/Users/${editingUser.id}`, editingUser)
        .then((response) => {
          const updated = response.data;
          setUsers(
            users.map((u) =>
              u.id === editingUser.id ? { ...u, ...updated } : u
            )
          );
          setEditingUser(null);
          setOriginalUser(null);
        })
        .catch((error) => {
          console.error("Error updating user:", error);
        });
    }
  };

  const handleDeleteUser = (id: string) => {
    api
      .delete(`/api/Users/${id}`)
      .then(() => {
        setUsers(users.filter((u) => u.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const handleAddUser = () => {
    setAddUserError(null);
    // Create a new object without id and createdAt
    const userPayload = {
      username: newUser.username,
      role: newUser.role,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phoneNumber: newUser.phoneNumber,
      password: newUser.password,
      ssn: newUser.ssn
    };
    
    api
      .post("/api/Users", userPayload)
      .then((response) => {
        setUsers([...users, response.data]);
        setIsAddUserOpen(false);
        setNewUser({
          id: "",
          username: "",
          role: "",
          email: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          password: "",
          ssn: "",
          createdAt: new Date().toISOString(),
        });
      })
      .catch((error) => {
        setAddUserError(error.response?.data?.message || "Failed to add user");
      });
  };

  const handlerCloseAddUser = () => {
    setNewUser({
      id: "",
      username: "",
      role: "",
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      password: "",
      ssn: "",
      createdAt: new Date().toISOString(),
    });
    setIsAddUserOpen(false);
  };

  // Render content for each tab
  let content = null;
  if (loading) {
    content = <div className="text-center py-8 text-gray-800">Loading...</div>;
  } else if (activeTab === "users") {
    content = (
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
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-800">First Name</label>
                  <input
                    type="text"
                    value={editingUser.firstName}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, firstName: e.target.value })
                    }
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-800">Last Name</label>
                  <input
                    type="text"
                    value={editingUser.lastName}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, lastName: e.target.value })
                    }
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-800">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-800">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, role: e.target.value })
                    }
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    required
                  >
                    <option value="User">User</option>
                    <option value="Librarian">Librarian</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-800">Phone</label>
                  <input
                    type="tel"
                    value={editingUser.phoneNumber ?? ""}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
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
                    <span className="text-sm font-medium text-gray-800">Username:</span>
                    <span className="font-medium text-gray-900">{user.username}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-800">Name:</span>
                    <span className="text-gray-900">{user.firstName} {user.lastName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-800">Email:</span>
                    <span className="text-gray-900">{user.email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-800">Role:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-900' :
                      user.role === 'Librarian' ? 'bg-blue-100 text-blue-900' :
                      'bg-green-100 text-green-900'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-800">Phone:</span>
                    <span className="text-gray-900">{user.phoneNumber || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-800">Created:</span>
                    <span className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</span>
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
  } else if (activeTab === "books") {
    content = books.map((book) => (
      <ViewBoardCard
        key={book.id}
        name={book.title}
        description={
          <div>
            <div>
              <strong>Author:</strong> {book.author}
            </div>
            <div>
              <strong>ISBN:</strong> {book.isbn}
            </div>
          </div>
        }
      />
    ));
  } else if (activeTab === "req") {
    content = dummyRequests.map((req) => (
      <ViewBoardCard
        key={req.id}
        name={req.name}
        description={`Status: ${req.status}`}
      />
    ));
  } else if (activeTab === "memberships") {
    content = memberships.map((m, idx) => (
      <ViewBoardCard
        key={idx}
        name={m.membershipType}
        description={`Price: ${m.price ?? "N/A"} | Duration: ${
          m.durationInDays
        } days | Limit: ${m.borrowLimit}`}
      />
    ));
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl p-8 min-w-[350px] max-w-[420px] shadow-lg w-full">
            <h2 className="font-bold text-2xl mb-5 text-center">
              Add New User
            </h2>
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleAddUser();
              }}
            >
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
              <input
                type="text"
                placeholder="First Name"
                value={newUser.firstName}
                onChange={(e) =>
                  setNewUser({ ...newUser, firstName: e.target.value })
                }
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newUser.lastName}
                onChange={(e) =>
                  setNewUser({ ...newUser, lastName: e.target.value })
                }
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
              <input
                type="text"
                placeholder="Role"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={newUser.phoneNumber ?? ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, phoneNumber: e.target.value })
                }
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <input
                type="text"
                placeholder="SSN"
                value={newUser.ssn}
                onChange={(e) =>
                  setNewUser({ ...newUser, ssn: e.target.value })
                }
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
              {addUserError && (
                <div className="text-red-600 text-center">{addUserError}</div>
              )}
              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-700 text-white font-medium hover:bg-blue-800 transition"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => handlerCloseAddUser()}
                  className="px-4 py-2 rounded bg-gray-400 text-white font-medium hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="flex flex-1">
        <Sidebar
          items={sidebarItems}
          activeKey={activeTab}
          onSelect={setActiveTab}
        />
        <main className="flex-1 px-10 py-8">
          <SearchBar onAdd={() => setIsAddUserOpen(true)} />
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <div className="bg-white rounded-xl shadow-md border p-6">
            <div className="flex flex-col gap-4 max-h-[420px] overflow-y-auto pr-2">
              {content}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

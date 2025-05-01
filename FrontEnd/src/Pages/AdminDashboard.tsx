import { useState, useEffect } from "react";
import {
  faUser,
  faBook,
  faCrown,
  faSignIn,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../Components/Sidebar";
import SearchBar from "../Components/SearchBar";
import ViewBoardCard from "../Components/ViewBoardCard";
import axios from "axios";
import { Book } from "../types/book";

const sidebarItems = [
  { key: "users", icon: faUser, label: "Manage Users" },
  { key: "books", icon: faBook, label: "Manage Books" },
  { key: "req", icon: faSignIn, label: "Registration Requests" },
  { key: "memberships", icon: faCrown, label: "Manage Membership plans" },
];

type User = {
  id: string;
  username: string;
  role: string;
  email: string;
  firstName: string;
  lastname: string;
  phonenumber: string | null;
  ssn: string;
};

type Membership = {
  membershipType: string;
  price: number | null;
  duration: number;
  borrowLimit: number;
  description: string;
  isfamilyPlan: boolean;
  maxFamilyMembers: number;
  requireApproval: boolean;
};

const dummyRequests = [
  { id: "1", status: "Pending", name: "Request from Alice" },
  { id: "2", status: "Pending", name: "Request from Bob" },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(false);

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState<User & { password: string }>({
    id: "", // Remove this if backend generates IDs
    username: "",
    role: "",
    email: "",
    firstName: "",
    lastname: "",
    phonenumber: "",
    password: "",
    ssn: "",
  });
  const [addUserError, setAddUserError] = useState<string | null>(null);

  // Fetch data for each tab (except requests)
  useEffect(() => {
    setLoading(true);
    if (activeTab === "users") {
      axios
        .get("/api/Users")
        .then((res) => setUsers(res.data))
        .catch(() => setUsers([]))
        .finally(() => setLoading(false));
    } else if (activeTab === "books") {
      axios
        .get("/api/Books")
        .then((res) => setBooks(res.data))
        .catch(() => setBooks([]))
        .finally(() => setLoading(false));
    } else if (activeTab === "memberships") {
      axios
        .get("/api/Membership")
        .then((res) => setMemberships(res.data))
        .catch(() => setMemberships([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [activeTab]);

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
      axios
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
    axios
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
    // Remove id from payload
    const { id, ...userPayload } = newUser;
    axios
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
          lastname: "",
          phonenumber: "",
          password: "",
          ssn: "",
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
      lastname: "",
      phonenumber: "",
      password: "",
      ssn: "",
    });
    setIsAddUserOpen(false);
  };

  // Render content for each tab
  let content = null;
  if (loading) {
    content = <div>Loading...</div>;
  } else if (activeTab === "users") {
    content = users.map((user) => (
      <div
        key={user.id}
        className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div className="flex-1">
          {editingUser && editingUser.id === user.id ? (
            <form
              className="flex flex-col md:flex-row md:items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveUser();
              }}
            >
              <input
                type="text"
                value={editingUser.firstName}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, firstName: e.target.value })
                }
                className="border rounded px-2 py-1 mr-2 mb-1"
                placeholder="First Name"
                required
              />
              <input
                type="text"
                value={editingUser.lastname}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, lastname: e.target.value })
                }
                className="border rounded px-2 py-1 mr-2 mb-1"
                placeholder="Last Name"
                required
              />
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
                className="border rounded px-2 py-1 mr-2 mb-1"
                placeholder="Email"
                required
              />
              <input
                type="text"
                value={editingUser.role}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, role: e.target.value })
                }
                className="border rounded px-2 py-1 mr-2 mb-1"
                placeholder="Role"
                required
              />
              <input
                type="text"
                value={editingUser.phonenumber ?? ""}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    phonenumber: e.target.value,
                  })
                }
                className="border rounded px-2 py-1 mr-2 mb-1"
                placeholder="Phone"
              />
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3 py-1 rounded bg-gray-400 text-white hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div>
                <strong>Username:</strong> {user.username}
              </div>
              <div>
                <strong>Full Name:</strong> {user.firstName} {user.lastname}
              </div>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              <div>
                <strong>Role:</strong> {user.role}
              </div>
              <div>
                <strong>Phone:</strong> {user.phonenumber ?? "N/A"}
              </div>
            </div>
          )}
        </div>
        {!editingUser || editingUser.id !== user.id ? (
          <div className="flex gap-2 justify-end md:justify-center mt-2 md:mt-0">
            <button
              onClick={() => handleEditUser(user)}
              className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteUser(user.id)}
              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>
    ));
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
          m.duration
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
                value={newUser.lastname}
                onChange={(e) =>
                  setNewUser({ ...newUser, lastname: e.target.value })
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
                value={newUser.phonenumber ?? ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, phonenumber: e.target.value })
                }
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
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

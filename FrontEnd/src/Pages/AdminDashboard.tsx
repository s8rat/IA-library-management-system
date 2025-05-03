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
import AddUserDialog from "../Components/AddUserDialog";
import UserList from "../Components/UserList";

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

const defaultNewUser = {
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
};

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

  // Add User dialog state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState<typeof defaultNewUser>({
    ...defaultNewUser,
  });
  const [addUserError, setAddUserError] = useState<string | null>(null);

  // Check authentication and role
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (!token || role !== "Admin") {
      navigate("/auth/login");
      return;
    }

    // Load data based on active tab
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        let response;
        switch (activeTab) {
          case "users":
            response = await api.get("/api/Users");
            setUsers(response.data);
            break;
          case "books":
            response = await api.get("/api/Books");
            setBooks(response.data);
            break;
          case "memberships":
            response = await api.get("/api/Membership");
            setMemberships(response.data);
            break;
        }
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error("Error loading data:", err);
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
      // Map to PascalCase for backend and ensure all required fields are present
      const payload = {
        Username: editingUser.username,
        Email: editingUser.email,
        FirstName: editingUser.firstName,
        LastName: editingUser.lastName,
        PhoneNumber: editingUser.phoneNumber ?? "",
        Role: editingUser.role,
        SSN: editingUser.ssn,
      };
      api
        .put(`/api/Users/${editingUser.id}`, payload)
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
          setError(error.response?.data?.message || "Error updating user.");
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
        setError(error.response?.data?.message || "Error deleting user.");
      });
  };

  const handleAddUser = () => {
    setAddUserError(null);
    // Map to PascalCase for backend
    const payload = {
      Username: newUser.username,
      Password: newUser.password,
      Role: newUser.role,
      Email: newUser.email,
      FirstName: newUser.firstName,
      LastName: newUser.lastName,
      SSN: newUser.ssn,
      PhoneNumber: newUser.phoneNumber,
    };
    api
      .post("/api/Users", payload)
      .then((response) => {
        setUsers([...users, response.data]);
        setIsAddUserOpen(false);
        setNewUser({ ...defaultNewUser });
      })
      .catch((error) => {
        setAddUserError(
          error.response?.data?.message ||
            error.response?.data?.title ||
            JSON.stringify(error.response?.data) ||
            "Failed to add user"
        );
      });
  };

  const handlerCloseAddUser = () => {
    setNewUser({ ...defaultNewUser });
    setIsAddUserOpen(false);
    setAddUserError(null);
  };

  // Render content for each tab
  let content = null;
  if (loading) {
    content = (
      <div className="flex justify-center items-center py-8">
        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></span>
        <span className="text-gray-800">Loading...</span>
      </div>
    );
  } else if (activeTab === "users") {
    content = (
      <UserList
        users={users}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        setOriginalUser={setOriginalUser}
        handleSaveUser={handleSaveUser}
        handleCancelEdit={handleCancelEdit}
        handleEditUser={handleEditUser}
        handleDeleteUser={handleDeleteUser}
      />
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
      <AddUserDialog
        open={isAddUserOpen}
        newUser={newUser}
        setNewUser={setNewUser}
        onClose={handlerCloseAddUser}
        onSubmit={handleAddUser}
        addUserError={addUserError}
      />
      <div className="flex flex-1">
        <Sidebar
          items={sidebarItems}
          activeKey={activeTab}
          onSelect={setActiveTab}
        />
        <main className="flex-1 px-10 py-8">
          <div className="flex items-center mb-6 gap-2">
            <SearchBar onAdd={() => setIsAddUserOpen(true)} />
          </div>
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  faUser,
  faBook,
  faCrown,
  faSignIn,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../Components/admin/Sidebar";
import SearchBar from "../Components/admin/SearchBar";
import ViewBoardCard from "../Components/admin/ViewBoardCard";
import api from "../Services/api";
import { User } from "../types/user";
import AddUserDialog from "../Components/admin/AddUserDialog";
import UserList from "../Components/admin/UserList";
import BookManagement from "../Components/Book/BookManagement";
import ManageMemberShip from "../Components/MemberShip/ManageMemberShip";

const sidebarItems = [
  { key: "users", icon: faUser, label: "Manage Users" },
  { key: "books", icon: faBook, label: "Manage Books" },
  { key: "req", icon: faSignIn, label: "Registration Requests" },
  { key: "memberships", icon: faCrown, label: "Manage Membership plans" },
];

const dummyRequests = [
  { id: "1", status: "Pending", name: "Request from Alice" },
  { id: "2", status: "Pending", name: "Request from Bob" },
];

const defaultNewUser = {
  id: 0,
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
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  // Add User dialog states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState<typeof defaultNewUser>({
    ...defaultNewUser,
  });
  const [addUserError, setAddUserError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!token) {
        navigate("/auth/login");
        return;
      }
      try {
        setLoading(true);
        setError(null);
        let response;
        switch (activeTab) {
          case "users":
            response = await api.get("/api/Users", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setUsers(response.data);
            setFilteredUsers(response.data);
            break;
        }
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
        console.log("Finished loading data for tab:", activeTab);
      }
    };

    loadData();
  }, [activeTab, navigate, token]);

  const handleSearch = (searchTerm: string) => {
    if (activeTab === "users") {
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleAddClick = () => {
    if (activeTab === "users") setIsAddUserOpen(true);
  };

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
      const payload = {
        id: editingUser.id,
        username: editingUser.username,
        email: editingUser.email,
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        phoneNumber: editingUser.phoneNumber ?? "",
        role: editingUser.role,
        ssn: editingUser.ssn,
        createdAt: editingUser.createdAt,
      };
      console.log("handleSaveUser: Saving user with payload:", payload);

      api
        .put(`/api/Users/${editingUser.id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const updated = response.data;
          console.log("handleSaveUser: User updated successfully:", updated);
          setUsers(
            users.map((u) =>
              u.id === editingUser.id ? { ...u, ...updated } : u
            )
          );
          setEditingUser(null);
          setOriginalUser(null);
        })
        .catch((error) => {
          console.error("handleSaveUser: Error updating user:", error);
          if (error.response) {
            console.error(
              "handleSaveUser: Error response data:",
              error.response.data
            );
          }
          setError(
            error.response?.data?.message ||
              error.response?.data?.title ||
              JSON.stringify(error.response?.data) ||
              "Error updating user."
          );
        });
    }
  };

  const handleDeleteUser = (id: number) => {
    api
      .delete(`/api/Users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
      .post("/api/Users", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
        users={filteredUsers}
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
    content = (
      <BookManagement
        containerClassName="w-full"
        searchBarClassName="justify-start"
        tableClassName="shadow-md"
      />
    );
  } else if (activeTab === "req") {
    content = dummyRequests.map((req) => (
      <ViewBoardCard
        key={req.id}
        name={req.name}
        description={`Status: ${req.status}`}
      />
    ));
  } else if (activeTab === "memberships") {
    content = <ManageMemberShip containerClassName="w-full" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {activeTab === "users" && (
        <AddUserDialog
          open={isAddUserOpen}
          newUser={newUser}
          setNewUser={setNewUser}
          onClose={handlerCloseAddUser}
          onSubmit={handleAddUser}
          addUserError={addUserError}
        />
      )}
      <div className="flex flex-1">
        <Sidebar
          items={sidebarItems}
          activeKey={activeTab}
          onSelect={setActiveTab}
        />
        <main className="flex-1 px-10 py-8">
          <div className="flex items-center mb-6 gap-2">
            {activeTab !== "books" && activeTab !== "memberships" && (
              <SearchBar
                onAdd={handleAddClick}
                onSearch={handleSearch}
                placeholder={
                  activeTab === "users" ? "Search users..." : "Search..."
                }
              />
            )}
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

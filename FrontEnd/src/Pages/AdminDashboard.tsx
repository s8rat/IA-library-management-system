import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  faUser,
  faBook,
  faCrown,
  faSignIn,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../Components/Sidebar";
import SearchBar from "../Components/SearchBar";
import ViewBoardCard from "../Components/ViewBoardCard";
import api from "../Services/api";
import { User } from "../types/user";
import AddUserDialog from "../Components/AddUserDialog";
import UserList from "../Components/UserList";
import MemberShipDialog from "../Components/MemberShip/MemberShipDialog";
import { Membership } from "../types/membership";
import BookManagement from "../Components/Book/BookManagement";
import EditMemberShipDialog from "../Components/MemberShip/EditMemberShipDialog";
import DeleteMemberShip from "../Components/MemberShip/DeleteMemberShip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

const defaultNewMembership: Membership = {
  membershipId: 0,
  membershipType: "",
  borrowLimit: 1,
  durationInDays: 30,
  price: undefined,
  description: "",
  isFamilyPlan: false,
  maxFamilyMembers: undefined,
  requiresApproval: false,
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add User dialog states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddMembershipOpen, setIsAddMembershipOpen] = useState(false);
  const [newUser, setNewUser] = useState<typeof defaultNewUser>({
    ...defaultNewUser,
  });
  const [addUserError, setAddUserError] = useState<string | null>(null);

  // Add Membership dialog states
  const [newMembership, setNewMembership] = useState<Membership>({
    ...defaultNewMembership,
  });
  const [addMembershipError, setAddMembershipError] = useState<string | null>(
    null
  );

  const [isEditMembershipOpen, setIsEditMembershipOpen] = useState(false);
  const [editingMembership, setEditingMembership] = useState<Membership | null>(null);
  const [editMembershipError, setEditMembershipError] = useState<string | null>(null);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImp0aSI6IjQxMWY2NmU4LTk5NWQtNDYwOS04YmQzLTJiYWJmZWE1YWEzYiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwidXNlcklkIjoxLCJleHAiOjE3NDY4NzYyMjMsImlzcyI6ImFhbGFtX2FsX2t1dHViIiwiYXVkIjoiYWFsYW1fYWxfa3V0dWJfdXNlcnMifQ.D91gNeQn5RhOhXhJ0SjnT0_OGmkPRYPJ_d9IFlUbJ_8";

  // Check authentication and role
  useEffect(() => {
    const loadData = async () => {
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
            break;
          case "memberships":
            response = await api.get("/api/Membership", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setMemberships(response.data);
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
  }, [activeTab, navigate]);

  const handleAddClick = () => {
    if (activeTab === "users") setIsAddUserOpen(true);
    else if (activeTab === "memberships") setIsAddMembershipOpen(true);
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
        Username: editingUser.username,
        Email: editingUser.email,
        FirstName: editingUser.firstName,
        LastName: editingUser.lastName,
        PhoneNumber: editingUser.phoneNumber ?? "",
        Role: editingUser.role,
        SSN: editingUser.ssn,
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

  // Membership handlers
  const handleAddMembership = (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    setAddMembershipError(null);

    api
      .post("/api/Membership", newMembership, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMemberships([...memberships, response.data]);
        setIsAddMembershipOpen(false);
        setNewMembership({ ...defaultNewMembership });
      })
      .catch((error) => {
        setAddMembershipError(
          error.response?.data?.message ||
            error.response?.data?.title ||
            JSON.stringify(error.response?.data) ||
            "Failed to add membership"
        );
      });
  };

  const handlerCloseAddMembership = () => {
    setNewMembership({ ...defaultNewMembership });
    setIsAddMembershipOpen(false);
    setAddMembershipError(null);
  };

  const handleEditMembership = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMembership) return;

    try {
      const response = await api.put(`/api/Membership/${editingMembership.membershipId}`, editingMembership, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMemberships(memberships.map(m => 
        m.membershipId === editingMembership.membershipId ? response.data : m
      ));
      setIsEditMembershipOpen(false);
      setEditingMembership(null);
    } catch (err) {
      setEditMembershipError('Failed to update membership');
      console.error('Error updating membership:', err);
    }
  };

  const handleDeleteMembership = async (membershipId: number) => {
    try {
      await api.delete(`/api/Membership/${membershipId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMemberships(memberships.filter(m => m.membershipId !== membershipId));
    } catch (err) {
      setError('Failed to delete membership');
      console.error('Error deleting membership:', err);
    }
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
    content = memberships.map((m) => (
      <div key={m.membershipId} className="bg-white p-6 rounded-lg shadow-md relative">
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => {
              setEditingMembership(m);
              setIsEditMembershipOpen(true);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <DeleteMemberShip
            membership={m}
            onDelete={() => handleDeleteMembership(m.membershipId)}
            className="text-red-600 hover:text-red-800"
          />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2 pr-16">{m.membershipType}</h3>
        <div className="space-y-2 text-gray-600">
          <p>Borrow Limit: {m.borrowLimit}</p>
          <p>Duration: {m.durationInDays} days</p>
          {m.price && <p>Price: {m.price} EGP</p>}
          {m.description && <p>Description: {m.description}</p>}
          <p>Family Plan: {m.isFamilyPlan ? 'Yes' : 'No'}</p>
          {m.isFamilyPlan && m.maxFamilyMembers && (
            <p>Max Family Members: {m.maxFamilyMembers}</p>
          )}
          <p>Requires Approval: {m.requiresApproval ? 'Yes' : 'No'}</p>
        </div>
      </div>
    ));
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
      {activeTab === "memberships" && (
        <>
          <MemberShipDialog
            open={isAddMembershipOpen}
            newMembership={newMembership}
            setNewMembership={setNewMembership}
            onClose={handlerCloseAddMembership}
            onSubmit={handleAddMembership}
            addMembershipError={addMembershipError}
          />
          {editingMembership && (
            <EditMemberShipDialog
              open={isEditMembershipOpen}
              membership={editingMembership}
              setMembership={setEditingMembership}
              onClose={() => {
                setIsEditMembershipOpen(false);
                setEditingMembership(null);
              }}
              onSubmit={handleEditMembership}
              editError={editMembershipError}
            />
          )}
        </>
      )}
      <div className="flex flex-1">
        <Sidebar
          items={sidebarItems}
          activeKey={activeTab}
          onSelect={setActiveTab}
        />
        <main className="flex-1 px-10 py-8">
          <div className="flex items-center mb-6 gap-2">
            {activeTab !== "books" && <SearchBar onAdd={handleAddClick} />}
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

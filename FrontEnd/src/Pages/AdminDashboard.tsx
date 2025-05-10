import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  faUser,
  faBook,
  faCrown,
  faSignIn,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import ViewBoardCard from "../components/ViewBoardCard";
import api from "../Services/api";
import { Book } from "../types/book";
import AddUserDialog from "../components/AddUserDialog";
import UserList from "../components/UserList";
import BookAddDialog from "../components/BookAddDialog";
import BookEditDialog from "../components/BookEditDialog";

const sidebarItems = [
  { key: "users", icon: faUser, label: "Manage Users" },
  { key: "books", icon: faBook, label: "Manage Books" },
  { key: "req", icon: faSignIn, label: "Registration Requests" },
  { key: "memberships", icon: faCrown, label: "Manage Membership plans" },
];

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

interface Membership {
  id: number;
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

const defaultNewBook = { title: "", author: "", isbn: "" };

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

  // ADd Book dialot states
  const [newBook, setNewBook] = useState({ ...defaultNewBook });
  const [addBookError, setAddBookError] = useState<string | null>(null);
  const [newBookImage, setNewBookImage] = useState<File | null>(null);

  // Edit Book dialog states
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [originalBook, setOriginalBook] = useState<Book | null>(null);
  const [editBookError, setEditBookError] = useState<string | null>(null);
  const [editBookImage, setEditBookImage] = useState<File | null>(null);

  // Add User dialog states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isAddMembershipOpen, setIsAddMembershipOpen] = useState(false);
  const [newUser, setNewUser] = useState<typeof defaultNewUser>({
    ...defaultNewUser,
  });
  const [addUserError, setAddUserError] = useState<string | null>(null);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImp0aSI6IjQxMWY2NmU4LTk5NWQtNDYwOS04YmQzLTJiYWJmZWE1YWEzYiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwidXNlcklkIjoxLCJleHAiOjE3NDY4NzYyMjMsImlzcyI6ImFhbGFtX2FsX2t1dHViIiwiYXVkIjoiYWFsYW1fYWxfa3V0dWJfdXNlcnMifQ.D91gNeQn5RhOhXhJ0SjnT0_OGmkPRYPJ_d9IFlUbJ_8";

  // Check authentication and role
  useEffect(() => {
    // const role = localStorage.getItem("userRole");
    // const token = localStorage.getItem("token");
    // if (!token || role !== "Admin") {
    //   console.warn("No token or not admin, redirecting...");
    //   navigate("/admin");
    //   return;
    // }

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
          case "books":
            response = await api.get("/api/Books");
            setBooks(response.data);
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

  // ...inside AdminDashboard component...
  const handleAddClick = () => {
    if (activeTab === "users") setIsAddUserOpen(true);
    else if (activeTab === "books") setIsAddBookOpen(true);
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

  // book handlers

  const handleAddBook = (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    setAddBookError(null);

    const formData = new FormData();
    formData.append("Title", newBook.title);
    formData.append("Author", newBook.author);
    formData.append("Isbn", newBook.isbn);
    if (newBookImage) {
      formData.append("CoverImage", newBookImage);
    }

    api
      .post("/api/Books", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setBooks([...books, response.data]);
        setIsAddBookOpen(false);
        setNewBook({ ...defaultNewBook });
        setNewBookImage(null);
      })
      .catch((error) => {
        setAddBookError(
          error.response?.data?.message ||
            error.response?.data?.title ||
            JSON.stringify(error.response?.data) ||
            "Failed to add book"
        );
      });
  };

  const handlerCloseAddBook = () => {
    setNewBook({ ...defaultNewBook });
    setIsAddBookOpen(false);
    setAddBookError(null);
  };

  const handleDeleteBook = (id: number) => {
    api
      .delete(`/api/Books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setBooks(books.filter((b) => b.id !== id));
      })
      .catch((error) => {
        setError(
          error.response?.data?.message ||
            error.response?.data?.title ||
            JSON.stringify(error.response?.data) ||
            "Error deleting book."
        );
      });
  };

  const handleEditBook = (book: Book) => {
    setEditingBook({ ...book });
    setOriginalBook({ ...book });
    setEditBookImage(null);
    setEditBookError(null);
  };

  const handleCancelEditBook = () => {
    setEditingBook(null);
    setOriginalBook(null);
    setEditBookImage(null);
    setEditBookError(null);
  };

  const handleSaveBook = (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    if (!editingBook) return;
    setEditBookError(null);

    const formData = new FormData();
    formData.append("Title", editingBook.title);
    formData.append("Author", editingBook.author);
    formData.append("Isbn", editingBook.isbn ?? "");
    if (editBookImage) {
      formData.append("CoverImage", editBookImage);
    }

    api
      .put(`/api/Books/${editingBook.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setBooks(
          books.map((b) =>
            b.id === editingBook.id ? { ...b, ...response.data } : b
          )
        );
        setEditingBook(null);
        setOriginalBook(null);
        setEditBookImage(null);
      })
      .catch((error) => {
        setEditBookError(
          error.response?.data?.message ||
            error.response?.data?.title ||
            JSON.stringify(error.response?.data) ||
            "Failed to update book"
        );
      });
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
            {book.coverImage && (
              <div className="mb-2 flex justify-center">
                <img
                  src={`data:${book.coverImageContentType};base64,${book.coverImage}`}
                  alt={`Cover of ${book.title}`}
                  className="w-32 h-40 object-cover rounded shadow"
                />
              </div>
            )}
            <div>
              <strong>Author:</strong> {book.author}
            </div>
            <div>
              <strong>ISBN:</strong> {book.isbn}
            </div>
          </div>
        }
        onDelete={() => handleDeleteBook(book.id)}
        onEdit={() => handleEditBook(book)}
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
      // ...inside your return statement, before the main layout...
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
      {activeTab === "books" && (
        <BookAddDialog
          open={isAddBookOpen}
          onClose={handlerCloseAddBook}
          onSubmit={handleAddBook}
          newBook={newBook}
          setNewBook={setNewBook}
          newBookImage={newBookImage}
          setNewBookImage={setNewBookImage}
          addError={addBookError}
        />
      )}
      {editingBook && (
        <BookEditDialog
          open={!!editingBook}
          onClose={handleCancelEditBook}
          onSubmit={handleSaveBook}
          editingBook={editingBook}
          setEditingBook={setEditingBook}
          editBookImage={editBookImage}
          setEditBookImage={setEditBookImage}
          editBookError={editBookError}
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
            <SearchBar onAdd={handleAddClick} />
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

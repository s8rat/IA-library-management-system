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

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch data for each tab
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
    }
  }, [activeTab]);

  // Render content for each tab
  let content = null;
  if (loading) {
    content = <div>Loading...</div>;
  } else if (activeTab === "users") {
    content = users.map((user, idx) => (
      <ViewBoardCard
        key={user.id || idx}
        name={user.username || user.firstName || "Unknown"}
        // Add more props/actions as needed
      />
    ));
  } else if (activeTab === "books") {
    content = books.map((book, idx) => (
      <ViewBoardCard
        key={book.id || idx}
        name={book.title || "Unknown Book"}
        // Add more props/actions as needed
      />
    ));
  } else if (activeTab === "memberships") {
    content = memberships.map((m, idx) => (
      <ViewBoardCard
        key={idx}
        name={m.membershipType || "Membership"}
        // Add more props/actions as needed
      />
    ));
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1">
        <Sidebar
          items={sidebarItems}
          activeKey={activeTab}
          onSelect={setActiveTab}
        />
        <main className="flex-1 px-10 py-8">
          <SearchBar />
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

import { useState } from "react";
import { faUser, faBook, faCrown } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../Components/Sidebar";
import SearchBar from "../Components/SearchBar";
import ViewBoardCard from "../Components/ViewBoardCard";

const sidebarItems = [
  { key: "users", icon: faUser, label: "Manage Users" },
  { key: "books", icon: faBook, label: "Manage Books" },
  { key: "req", icon: faBook, label: "Registration Requests" },
  { key: "memberships", icon: faCrown, label: "Manage Membership plans" },
];

const users = [
  { name: "John Doe" },
  { name: "Jane Smith" },
  { name: "Alice Johnson" },
  { name: "Bob Brown" },
];

const books = [{ name: "Book 1" }, { name: "Book 2" }];

const regirtrationReq = [{ name: "Registrations" }];

const memberships = [{ name: "Membership Plan 1" }];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");

  let content = null;
  if (activeTab === "users") content = users;
  else if (activeTab === "books") content = books;
  else if (activeTab === "req") content = regirtrationReq;
  else if (activeTab === "memberships") content = memberships;

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
              {content &&
                content.map((item, idx) => (
                  <ViewBoardCard key={item.name + idx} name={item.name} />
                ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

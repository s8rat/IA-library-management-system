import {
  faUser,
  faBook,
  faTabletAlt,
  faChartBar,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../Components/Sidebar";
import SearchBar from "../Components/SearchBar";
import ViewBoardCard from "../Components/ViewBoardCard";

const sidebarItems = [
  { icon: faUser, label: "Manage Users", active: true },
  { icon: faBook, label: "Manage Books" },
  { icon: faTabletAlt, label: "Manage E-Books" },
  { icon: faChartBar, label: "Generate Reports" },
  { icon: faCrown, label: "Manage Membership plans" },
];

const users = [
  { name: "John Doe", hasHistory: true },
  { name: "Jane Smith", hasHistory: false },
  { name: "Alice Johnson", hasHistory: true },
  { name: "Bob Brown", hasHistory: false },
];

const AdminDashboard = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <div className="flex flex-1">
      <Sidebar items={sidebarItems} />
      <main className="flex-1 px-10 py-8">
        <SearchBar />
        <div className="bg-white rounded-xl shadow-md border p-6">
          <div className="flex flex-col gap-4 max-h-[420px] overflow-y-auto pr-2">
            {users.map((user, idx) => (
              <ViewBoardCard key={user.name + idx} name={user.name} />
            ))}
          </div>
        </div>
      </main>
    </div>
  </div>
);

export default AdminDashboard;

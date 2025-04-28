import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCog, faChartBar } from "@fortawesome/free-solid-svg-icons";
import AdminCard from "../Components/AdminCard";

export const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-3">
      <div className="bg-gray-300 h-screen col-span-1 flex flex-col items-center justify-center border-r border-gray-500">
        <AdminCard
          name="Manage Users"
          icon={<FontAwesomeIcon className="size-5 mr-2" icon={faUser} />}
        />
        <AdminCard
          name="Settings"
          icon={<FontAwesomeIcon className="size-5 mr-2" icon={faCog} />}
        />
        <AdminCard
          name="Reports"
          icon={<FontAwesomeIcon className="size-5 mr-2" icon={faChartBar} />}
        />
      </div>
      <div className="bg-gray-300 h-screen col-span-2 flex items-center justify-center">
        hh
      </div>
    </div>
  );
};

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCog,
  faChartBar,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import AdminCard from "../Components/AdminCard";
import ViewBoard from "../Components/ViewBoard";
import ViewBoardCard from "../Components/ViewBoardCard";

export const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-3 pt-16">
      <div className="bg-gray-100 h-screen col-span-1 flex flex-col items-center justify-center border-r border-gray-500">
        <AdminCard
          name="Manage Users"
          icon={
            <FontAwesomeIcon
              className="size-5 mr-2 text-gray-600"
              icon={faUser}
            />
          }
        />
        <AdminCard
          name="Settings"
          icon={
            <FontAwesomeIcon
              className="size-5 mr-2 text-gray-600"
              icon={faCog}
            />
          }
        />
        <AdminCard
          name="Reports"
          icon={
            <FontAwesomeIcon
              className="size-5 mr-2 text-gray-600"
              icon={faChartBar}
            />
          }
        />
        <AdminCard
          name="Manage Memeberships"
          icon={
            <FontAwesomeIcon
              className="size-5 mr-2 text-gray-600"
              icon={faCrown}
            />
          }
        />
      </div>
      <div className="bg-gray-100 h-screen col-span-2 flex items-center justify-center">
        <ViewBoard name="Users">
          <ViewBoardCard name="bota" />
        </ViewBoard>
      </div>
    </div>
  );
};

import { ReactNode } from "react";

interface IAdminCard {
  name: string;
  onclick?: () => void;
  icon?: ReactNode;
}

const AdminCard = ({ name, icon, onclick }: IAdminCard) => {
  return (
    <button className="flex flex-row items-center justify-normal bg-white shadow-lg rounded-lg p-4 w-48 h-12 m-4 hover:shadow-xl transition-shadow duration-300">
      <div className="text-3xl text-blue-600 mb-3">{icon}</div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{name}</h2>
    </button>
  );
};

export default AdminCard;

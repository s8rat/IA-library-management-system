import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BookManage from "../Components/BookMange";
import {
  faBook,
  faChartBar,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";

const boards = [
  {
    name: "Manage Books",
    icon: faBook,
    content: <BookManage />,
  },
  {
    name: "Borrow Requests",
    icon: faChartBar,
    content: <div>Borrow requests content goes here.</div>,
  },
  {
    name: "Manage Memberships",
    icon: faCrown,
    content: <div>Membership content goes here.</div>,
  },
];

export const Library = () => {
  const [selected, setSelected] = useState(0);

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-3 pt-16">
      <div className="bg-gray-100 h-screen col-span-1 flex flex-col items-center justify-center border-r border-indigo-500">
        {boards.map((board, idx) => (
          <button
            key={board.name}
            className={`w-full mb-4 p-4 rounded text-left flex items-center transition-colors duration-200 ${
              selected === idx
                ? "bg-blue-600 text-white shadow font-bold"
                : "bg-white text-blue-600 hover:bg-gray-100"
            }`}
            onClick={() => setSelected(idx)}
          >
            <FontAwesomeIcon className="size-5 mr-2" icon={board.icon} />
            {board.name}
          </button>
        ))}
      </div>
      <div className="col-span-2 p-8">
        {boards[selected].content}
      </div>
    </div>
  );
};

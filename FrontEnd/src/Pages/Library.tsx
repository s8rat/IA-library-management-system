import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faChartBar, faCrown } from "@fortawesome/free-solid-svg-icons";
import BookManagement from "../Components/Book/BookManagement";

const boards = [
  {
    name: "Manage Books",
    icon: faBook,
    content: (
      <BookManagement
        containerClassName="w-full"
        searchBarClassName="justify-center"
        tableClassName="shadow-lg border border-gray-200"
      />
    ),
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
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);

  // Check authentication and role on component mount
  useEffect(() => {
    // const token = localStorage.getItem('token');
    // const role = localStorage.getItem('userRole');

    // if (!token || role !== 'Librarian') {
    //   navigate('/auth/login');
    //   return;
    // }

    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto min-h-screen flex pt-4 bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-blue-50 h-[80vh] mt-2 rounded-xl shadow-lg flex flex-col items-center border-r border-indigo-100 overflow-y-auto">
        <div className="w-full py-4 flex flex-col gap-2">
          {boards.map((board, idx) => (
            <button
              key={board.name}
              className={`w-11/12 mx-auto mb-2 p-4 rounded-lg text-left flex items-center transition-colors duration-200 font-semibold ${
                selected === idx
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-blue-700 hover:bg-blue-100"
              }`}
              onClick={() => setSelected(idx)}
            >
              <FontAwesomeIcon className="size-5 mr-3" icon={board.icon} />
              {board.name}
            </button>
          ))}
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-10 mt-2 ml-8 bg-white rounded-xl shadow-lg overflow-y-auto min-h-[80vh]">
        {boards[selected].content}
      </div>
    </div>
  );
};

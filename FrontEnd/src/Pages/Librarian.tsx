import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faChartBar, faCrown } from "@fortawesome/free-solid-svg-icons";
import BookManagement from "../components/Book/BookManagement";
import ManageMemberShip from "../components/MemberShip/ManageMemberShip";
import SeeBorrowRequest from "../components/Librarian/SeeBorrowRequst";
import SeeReturnRequest from "../components/Librarian/SeeReturnRequst";
import AcceptSubPlan from '../components/Librarian/AcceptSubPlan';

export const Librarian = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (!token || role !== 'Librarian') {
      navigate('/auth/login');
      return;
    }
    setLoading(false);
  }, [navigate]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX) return;

    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX;

    // Open sidebar if swiping right from left edge
    if (touchStartX < 50 && diff > 50) {
      setIsSidebarOpen(true);
    }
    // Close sidebar if swiping left
    else if (diff < -50) {
      setIsSidebarOpen(false);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(0);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Board configurations
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
      content: <SeeBorrowRequest />,
    },  
    {
      name: "Return Requests",
      icon: faChartBar,
      content: <SeeReturnRequest />,
    },
    {
      name: "Manage Memberships",
      icon: faCrown,
      content: <ManageMemberShip containerClassName="w-full" />
    },
    {
      name: "Approve Subscriptions",
      icon: faCrown,
      content: <AcceptSubPlan />,
    },
  ];

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
    <div 
      className="relative min-h-screen flex flex-col md:flex-row bg-gray-50"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-lg bg-blue-600 text-white"
        onClick={toggleSidebar}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* Sidebar */}
      <nav className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-200 ease-out
        fixed md:static
        w-72 z-10
        h-screen md:h-auto
        bg-blue-50
        md:translate-x-0
        flex flex-col
        overflow-y-auto
        shadow-lg
      `}>
        <div className="w-full py-4 flex flex-col gap-2">
          <div className="px-6 pb-2 text-xs text-gray-500 font-semibold tracking-widest uppercase">
            Navigation
          </div>
          {boards.map((board, idx) => (
            <button
              key={board.name}
              className={`w-11/12 mx-auto mb-2 p-4 rounded-lg text-left flex items-center transition-all duration-200 font-semibold group shadow-sm border border-transparent ${
                selected === idx
                  ? "bg-blue-600 text-white shadow border-blue-700 scale-[1.02]"
                  : "bg-white text-blue-700 hover:bg-blue-100 hover:border-blue-300"
              }`}
              onClick={() => {
                setSelected(idx);
                if (window.innerWidth < 768) { // Close sidebar on mobile after selection
                  setIsSidebarOpen(false);
                }
              }}
            >
              <FontAwesomeIcon 
                className={`size-5 mr-3 ${
                  selected === idx ? 'text-white' : 'text-blue-500 group-hover:text-blue-700'
                }`} 
                icon={board.icon}
              />
              {board.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 mt-16 md:mt-0">
        <div className="w-full h-full bg-white rounded-xl shadow-lg overflow-y-auto min-h-[80vh] p-4 md:p-6 lg:p-8">
          <div className="w-full h-full flex flex-col">
            {boards[selected].content}
          </div>
        </div>
      </main>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black transition-opacity duration-200 ease-out bg-opacity-50 z-0"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

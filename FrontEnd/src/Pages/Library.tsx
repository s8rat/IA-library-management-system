import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faChartBar, faCrown, faEdit } from "@fortawesome/free-solid-svg-icons";
import BookManagement from "../Components/Book/BookManagement";
import MemberShipDialog from "../Components/MemberShip/MemberShipDialog";
import EditMemberShipDialog from "../Components/MemberShip/EditMemberShipDialog";
import DeleteMemberShip from "../Components/MemberShip/DeleteMemberShip";
import { Membership } from "../types/membership";
import api from "../Services/api";

export const Library = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [editingMembership, setEditingMembership] = useState<Membership | null>(null);
  const [newMembership, setNewMembership] = useState<Membership>({
    membershipId: 0,
    membershipType: '',
    borrowLimit: 0,
    durationInDays: 0,
    isFamilyPlan: false,
    requiresApproval: false
  });
  const [membershipError, setMembershipError] = useState('');

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'Librarian') {
      navigate('/auth/login');
      return;
    }
  }, [navigate]);

  // Fetch memberships
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await api.get('/api/Membership');
        setMemberships(response.data);
      } catch (err) {
        setMembershipError('Failed to load memberships');
        console.error('Error fetching memberships:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  // Membership handlers
  const handleAddMembership = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/Membership', newMembership);
      setMemberships([...memberships, response.data]);
      setIsDialogOpen(false);
      setNewMembership({
        membershipId: 0,
        membershipType: '',
        borrowLimit: 0,
        durationInDays: 0,
        isFamilyPlan: false,
        requiresApproval: false
      });
    } catch (err) {
      setMembershipError('Failed to add membership');
      console.error('Error adding membership:', err);
    }
  };

  const handleEditMembership = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMembership) return;

    try {
      const response = await api.put(`/api/Membership/${editingMembership.membershipId}`, editingMembership);
      setMemberships(memberships.map(m => 
        m.membershipId === editingMembership.membershipId ? response.data : m
      ));
      setIsEditDialogOpen(false);
      setEditingMembership(null);
    } catch (err) {
      setMembershipError('Failed to update membership');
      console.error('Error updating membership:', err);
    }
  };

  const handleDeleteMembership = async (membershipId: number) => {
    try {
      await api.delete(`/api/Membership/${membershipId}`);
      setMemberships(memberships.filter(m => m.membershipId !== membershipId));
    } catch (err) {
      setMembershipError('Failed to delete membership');
      console.error('Error deleting membership:', err);
    }
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
      content: <div>Borrow requests content goes here.</div>,
    },
    {
      name: "Manage Memberships",
      icon: faCrown,
      content: (
        <div className="w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Membership Plans</h2>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add New Plan
            </button>
          </div>
          {membershipError && (
            <div className="text-red-600 text-center text-sm mb-4">
              {membershipError}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memberships.map((membership) => (
              <div key={membership.membershipId} className="bg-white p-6 rounded-lg shadow-md relative">
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingMembership(membership);
                      setIsEditDialogOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <DeleteMemberShip
                    membership={membership}
                    onDelete={() => handleDeleteMembership(membership.membershipId)}
                    className="text-red-600 hover:text-red-800"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 pr-16">{membership.membershipType}</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Borrow Limit: {membership.borrowLimit}</p>
                  <p>Duration: {membership.durationInDays} days</p>
                  {membership.price && <p>Price: {membership.price} EGP</p>}
                  {membership.description && <p>Description: {membership.description}</p>}
                  <p>Family Plan: {membership.isFamilyPlan ? 'Yes' : 'No'}</p>
                  {membership.isFamilyPlan && membership.maxFamilyMembers && (
                    <p>Max Family Members: {membership.maxFamilyMembers}</p>
                  )}
                  <p>Requires Approval: {membership.requiresApproval ? 'Yes' : 'No'}</p>
                </div>
              </div>
            ))}
          </div>
          <MemberShipDialog 
            open={isDialogOpen} 
            newMembership={newMembership} 
            setNewMembership={setNewMembership} 
            onClose={() => setIsDialogOpen(false)} 
            onSubmit={handleAddMembership} 
            addMembershipError={membershipError} 
          />
          {editingMembership && (
            <EditMemberShipDialog
              open={isEditDialogOpen}
              membership={editingMembership}
              setMembership={setEditingMembership}
              onClose={() => {
                setIsEditDialogOpen(false);
                setEditingMembership(null);
              }}
              onSubmit={handleEditMembership}
              editError={membershipError}
            />
          )}
        </div>
      )
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

import React, { useEffect, useState } from 'react';
import api from '../../Services/api';

interface UserMembership {
  userMembershipId: number;
  userId: number;
  membershipId: number;
  status: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  isCanceled: boolean;
  // ...other fields as needed
}

interface ApiError {
  response?: {
    data: {
      message?: string;
    };
  };
}

const AcceptSubPlan: React.FC = () => {
  const [requests, setRequests] = useState<UserMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/Membership/requests'); // Corrected endpoint to plural
      setRequests(res.data);
      setError(null);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userMembershipId: number) => {
    setProcessing(userMembershipId);
    setError(null);
    setSuccess(null);
    try {
      await api.put(`/api/Membership/approve/${userMembershipId}?approverId=1`); // Replace 1 with actual librarian id
      setSuccess('Subscription approved.');
      await fetchRequests();
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Failed to approve request');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (userMembershipId: number) => {
    setProcessing(userMembershipId);
    setError(null);
    setSuccess(null);
    try {
      await api.put(`/api/Membership/reject/${userMembershipId}?approverId=1`); // Replace 1 with actual librarian id
      setSuccess('Subscription rejected.');
      await fetchRequests();
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Failed to reject request');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Pending Subscription Requests</h2>
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 mb-2">{error}</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">Membership ID</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-4">No pending requests</td></tr>
            ) : (
              requests.map(req => (
                <tr key={req.userMembershipId} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{req.userId}</td>
                  <td className="px-4 py-2">{req.membershipId}</td>
                  <td className="px-4 py-2">{req.status}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleApprove(req.userMembershipId)}
                      disabled={processing === req.userMembershipId}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req.userMembershipId)}
                      disabled={processing === req.userMembershipId}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      {success && <div className="text-green-600 mt-2">{success}</div>}
    </div>
  );
};

export default AcceptSubPlan;

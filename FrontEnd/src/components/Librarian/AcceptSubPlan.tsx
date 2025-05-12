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
  membership: {
    membershipType: string;
    borrowLimit: number;
    durationInDays: number;
    price: number | null;
    isFamilyPlan: boolean;
  };
  user: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };
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
      setError(null);
      const res = await api.get('/api/Membership/requests');
      setRequests(res.data);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Failed to load requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getUserId = (): number | null => {
    const userId = localStorage.getItem('userId');
    if (!userId) return null;
    const parsedId = parseInt(userId);
    return isNaN(parsedId) ? null : parsedId;
  };

  const handleApprove = async (userMembershipId: number) => {
    const userId = getUserId();
    if (!userId) {
      setError('Authentication required. Please log in again.');
      return;
    }

    setProcessing(userMembershipId);
    setError(null);
    setSuccess(null);

    try {
      await api.put(`/api/Membership/approve/${userMembershipId}`, null, {
        params: { approverId: userId }
      });
      setSuccess('Subscription approved successfully');
      await fetchRequests();
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Failed to approve request. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (userMembershipId: number) => {
    const userId = getUserId();
    if (!userId) {
      setError('Authentication required. Please log in again.');
      return;
    }

    setProcessing(userMembershipId);
    setError(null);
    setSuccess(null);

    try {
      await api.put(`/api/Membership/reject/${userMembershipId}`, null, {
        params: { approverId: userId }
      });
      setSuccess('Subscription rejected successfully');
      await fetchRequests();
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Failed to reject request. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Pending Subscription Requests</h2>
        <button
          onClick={fetchRequests}
          className="px-4 py-2 text-sm font-medium bg-white text-black hover:text-gray-800"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 mb-4 p-4 bg-red-50 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-800 hover:text-red-900"
          >
            ×
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No pending requests
                  </td>
                </tr>
              ) : (
                requests.map(req => (
                  <tr key={req.userMembershipId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{req.user.firstName} {req.user.lastName}</div>
                      <div className="text-sm text-gray-500">{req.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{req.membership.membershipType}</div>
                      <div className="text-sm text-gray-500">
                        {req.membership.isFamilyPlan ? 'Family Plan' : 'Individual Plan'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Borrow Limit: {req.membership.borrowLimit}
                      </div>
                      <div className="text-sm text-gray-500">
                        Duration: {req.membership.durationInDays} days
                      </div>
                      {req.membership.price && (
                        <div className="text-sm text-gray-500">
                          Price: ${req.membership.price}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(req.startDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(req.userMembershipId)}
                          disabled={processing === req.userMembershipId || req.status !== 'Pending'}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          {processing === req.userMembershipId ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(req.userMembershipId)}
                          disabled={processing === req.userMembershipId || req.status !== 'Pending'}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          {processing === req.userMembershipId ? 'Processing...' : 'Reject'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {success && (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center justify-between">
          <span>{success}</span>
          <button
            onClick={() => setSuccess(null)}
            className="text-green-800 hover:text-green-900"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default AcceptSubPlan;

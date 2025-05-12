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
    <div className="w-full h-full bg-white p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Pending Subscription Requests</h2>
        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 shadow-sm transition-all duration-200 hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-500">Loading requests...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-auto text-red-700 hover:text-red-900">×</button>
          </div>
        </div>
      ) : (
        <div className="h-full bg-white rounded-lg border border-gray-100 overflow-hidden">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium">No pending requests</p>
              <p className="text-sm text-gray-400">New subscription requests will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                    <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {requests.map(req => (
                    <tr key={req.userMembershipId} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-2 sm:px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{req.user.firstName} {req.user.lastName}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{req.user.email}</div>
                        <div className="sm:hidden text-xs text-gray-500 mt-1">
                          {req.membership.membershipType} - {formatDate(req.startDate)}
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4">
                        <div className="text-sm text-gray-900">{req.membership.membershipType}</div>
                        <div className="text-sm text-gray-500">
                          {req.membership.isFamilyPlan ? 'Family Plan' : 'Individual Plan'}
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4">
                        <div className="text-sm text-gray-900">
                          Borrow Limit: {req.membership.borrowLimit}
                        </div>
                        <div className="text-sm text-gray-500">
                          Duration: {req.membership.durationInDays} days
                          {req.membership.price && ` • $${req.membership.price}`}
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {formatDate(req.startDate)}
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-4">
                        <div className="flex flex-col sm:flex-row gap-2 justify-end">
                          <button
                            onClick={() => handleApprove(req.userMembershipId)}
                            disabled={processing === req.userMembershipId || req.status !== 'Pending'}
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          >
                            {processing === req.userMembershipId ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                              </>
                            ) : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(req.userMembershipId)}
                            disabled={processing === req.userMembershipId || req.status !== 'Pending'}
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          >
                            {processing === req.userMembershipId ? 'Processing...' : 'Reject'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {success && (
        <div className="fixed bottom-4 right-4 bg-green-50 text-green-900 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-fade-in-up">
          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-sm font-medium">{success}</p>
          <button onClick={() => setSuccess(null)} className="text-green-800 hover:text-green-900">×</button>
        </div>
      )}
    </div>
  );
};

export default AcceptSubPlan;

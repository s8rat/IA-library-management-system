import React, { useEffect, useState } from 'react';
import api from '../../Services/api';

interface Membership {
  membershipId: number;
  membershipType: string;
  borrowLimit: number;
  durationInDays: number;
  price: number | null;
  description?: string;
  isFamilyPlan: boolean;
  maxFamilyMembers?: number;
  requiresApproval: boolean;
}

interface ApiError {
  response?: {
    data: {
      message?: string;
    };
  };
}

const UserSelectPlanDialouge: React.FC<{ onRequestSent?: () => void }> = ({ onRequestSent }) => {
  const [plans, setPlans] = useState<Membership[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/Membership');
        setPlans(res.data);
        setError(null);
      } catch (err: unknown) {
        const apiError = err as ApiError;
        setError(apiError.response?.data?.message || 'Failed to load plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubmit = async () => {
    if (!selectedPlan) {
      setError('Please select a plan');
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      // Get userId from localStorage or auth context
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id;
      if (!userId) {
        setError('User not logged in');
        setSubmitting(false);
        return;
      }
      await api.post('/api/Membership/request', { userId, membershipId: selectedPlan });
      setSuccess('Request sent to librarian for approval.');
      if (onRequestSent) onRequestSent();
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Select a Membership Plan</h2>
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 mb-2">{error}</div>
      ) : (
        <>
          <ul className="space-y-3 mb-4">
            {plans.map(plan => (
              <li key={plan.membershipId} className={`border rounded-lg p-4 cursor-pointer ${selectedPlan === plan.membershipId ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`} onClick={() => setSelectedPlan(plan.membershipId)}>                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg text-black">{plan.membershipType}</div>
                    <div className="text-gray-600 text-sm">{plan.description}</div>
                    <div className="text-gray-500 text-xs mt-1">Borrow Limit: {plan.borrowLimit} | Duration: {plan.durationInDays} days | Price: {plan.price ? `$${plan.price}` : 'Free'}</div>
                  </div>
                  {selectedPlan === plan.membershipId && <span className="text-blue-600 font-bold">Selected</span>}
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Sending Request...' : 'Send Request'}
          </button>
          {success && <div className="text-green-600 mt-2">{success}</div>}
        </>
      )}
    </div>
  );
};

export default UserSelectPlanDialouge;

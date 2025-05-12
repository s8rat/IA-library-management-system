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
    status?: number;
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
  const [currentMembership, setCurrentMembership] = useState<Membership | null>(null);
  const [showPlanSelection, setShowPlanSelection] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch plans first
        const plansRes = await api.get('/api/Membership');
        setPlans(plansRes.data);

        // Then try to fetch current membership
        const userId = localStorage.getItem('userId');
        if (userId) {
          try {
            const membershipRes = await api.get(`/api/Membership/user/${userId}`);
            if (membershipRes.data) {
              setCurrentMembership(membershipRes.data);
              setShowPlanSelection(false);
            } else {
              setShowPlanSelection(true);
            }
          } catch (membershipErr: unknown) {
            if (membershipErr instanceof Error && (membershipErr as ApiError).response?.status === 404) {
              // User doesn't have a membership yet - this is normal
              setShowPlanSelection(true);
            } else {
              console.error('Error fetching membership:', membershipErr);
            }
          }
        }
        setError(null);
        
      } catch (err: unknown) {
        const apiError = err as ApiError;
        setError(apiError.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      // Get userId from localStorage
      const userId = localStorage.getItem('userId');

      console.log(userId);
      if (!userId) {
        setError('User not logged in');
        setSubmitting(false);
        return;
      }

      const selectedPlanData = plans.find(p => p.membershipId === selectedPlan);
      if (!selectedPlanData) {
        setError('Selected plan not found');
        setSubmitting(false);
        return;
      }

      const requestData = {
        userId: parseInt(userId),
        membershipId: selectedPlan,
        parentUserId: selectedPlanData.isFamilyPlan ? parseInt(userId) : null
      };

      await api.post('/api/Membership/request', requestData);
      setSuccess('Request sent to librarian for approval.');
      if (onRequestSent) onRequestSent();
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  if (!showPlanSelection && currentMembership) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-4">Current Membership Plan</h2>
        <div className="border rounded-lg p-4 mb-4">
          <div className="font-bold text-lg text-black">{currentMembership.membershipType}</div>
          <div className="text-gray-600 text-sm">{currentMembership.description}</div>
          <div className="text-gray-500 text-xs mt-1">
            Borrow Limit: {currentMembership.borrowLimit} | Duration: {currentMembership.durationInDays} days
            | Price: {currentMembership.price ? `$${currentMembership.price}` : 'Free'}
          </div>
        </div>
        <button
          onClick={() => setShowPlanSelection(true)}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Change Plan
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Select a Membership Plan</h2>
        {currentMembership && (
          <button
            onClick={() => setShowPlanSelection(false)}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Current Plan
          </button>
        )}
      </div>
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

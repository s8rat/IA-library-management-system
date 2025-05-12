import React, { useEffect, useState } from 'react';

const JoinUS: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Replace with your actual token retrieval logic
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('You are not logged in. Please log in as an admin to view librarian requests.');
      return;
    }
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/Librarian/requests?status=pending', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 401 || res.status === 403) {
          setError('You are not authorized. Please log in as an admin.');
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch requests');
        const text = await res.text();
        if (text.trim().startsWith('<!DOCTYPE html') || text.trim().startsWith('<html')) {
          setError(
            'Received HTML instead of JSON. This usually means the backend is not running, the API route is incorrect, or the frontend is not properly proxying API requests. Please check your backend server and Vite proxy configuration.'
          );
          setLoading(false);
          return;
        }
        try {
          const data = JSON.parse(text);
          setRequests(data);
        } catch {
          setError(
            'Unexpected server response. This may be due to a session timeout or server misconfiguration. Please log out and log in again, and ensure you have admin privileges.'
          );
        }
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchRequests();
  }, [token]);

  const approveRequest = async (requestId: number) => {
    try {
      const res = await fetch(`/api/Librarian/approve/${requestId}`, {
        method: 'POST',
        headers:
          {
            Authorization: `Bearer ${token}`,
          },
      });
      if (!res.ok) throw new Error('Failed to approve request');
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Join Us</h2>
      <p>Welcome to the library management system. Please contact admin to join.</p>
      <p>
        If you requested to become a librarian, your request will be reviewed by the admin.
        Once approved, you will receive a confirmation and gain librarian privileges.
      </p>
      <p>
        <strong>Note:</strong> Librarian requests must be approved by an admin before you can access librarian features.
      </p>
      <hr />
      <h3>Pending Librarian Requests</h3>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!error && requests.length === 0 && !loading && <p>No pending requests.</p>}
      <ul>
        {requests.map((req) => (
          <li key={req.id}>
            {req.userName || req.email || `Request #${req.id}`}
            <button onClick={() => approveRequest(req.id)} style={{ marginLeft: 8 }}>
              Approve
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JoinUS;

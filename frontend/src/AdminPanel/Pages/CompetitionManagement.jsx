import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Download, CheckCircle, XCircle, Trophy, Users, Calendar, Clock } from 'lucide-react';

const CompetitionManagement = () => {
  const [activeTab, setActiveTab] = useState('applied');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://itu-r1qa.onrender.com');

  useEffect(() => {
    fetchRegistrations();
  }, [activeTab]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const status = activeTab === 'applied' ? 'pending' : null;
      const params = status ? { status } : {};

      const response = await axios.get(`${API_BASE_URL}/api/competition/admin/list`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.data.success) {
        // Filter by status for tabs
        if (activeTab === 'applied') {
          setRegistrations(response.data.data.filter(r => r.status === 'pending') || []);
        } else {
          setRegistrations(response.data.data.filter(r => r.status !== 'pending') || []);
        }
      }
    } catch (error) {
      console.error('Error fetching competition registrations:', error);
      toast.error('Failed to load competition registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (registrationId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/competition/admin/${registrationId}/download`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `competition-${registrationId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Excel file downloaded successfully');
    } catch (error) {
      console.error('Error downloading Excel:', error);
      toast.error('Failed to download Excel file');
    }
  };

  const handleApprove = async (registrationId) => {
    if (!window.confirm('Are you sure you want to approve this competition registration?')) {
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/competition/admin/${registrationId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Competition registration approved');
        fetchRegistrations();
      }
    } catch (error) {
      console.error('Error approving registration:', error);
      toast.error(error.response?.data?.error || 'Failed to approve registration');
    }
  };

  const handleReject = async (registrationId) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/competition/admin/${registrationId}/reject`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Competition registration rejected');
        fetchRegistrations();
      }
    } catch (error) {
      console.error('Error rejecting registration:', error);
      toast.error(error.response?.data?.error || 'Failed to reject registration');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Trophy className="text-yellow-600" size={28} />
          Competition Registration Management
        </h2>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('applied')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applied'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Applied
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              History
            </button>
          </nav>
        </div>

        {/* Registrations List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading registrations...</p>
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Trophy size={48} className="mx-auto mb-4 text-gray-400" />
            <p>No {activeTab === 'applied' ? 'pending' : 'historical'} competition registrations found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((registration) => (
              <div key={registration._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{registration.competitionTitle}</h3>
                    <p className="text-sm text-gray-600">
                      {registration.unionName} • {registration.state} {registration.district && `• ${registration.district}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Category: {registration.competitionCategory} • Submitted: {new Date(registration.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(registration.status)}
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={16} className="text-gray-400" />
                    <span><strong>{registration.players.length}</strong> player(s) registered</span>
                  </div>
                </div>

                {/* Players List */}
                <div className="mb-4 bg-gray-50 p-3 rounded">
                  <p className="text-sm font-medium mb-2">Registered Players:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {registration.players.map((player, index) => (
                      <div key={index} className="text-sm text-gray-700">
                        {index + 1}. {player.playerName} ({player.beltLevel || 'N/A'})
                      </div>
                    ))}
                  </div>
                </div>

                {registration.status === 'rejected' && registration.rejectionReason && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                    <strong>Rejection Reason:</strong> {registration.rejectionReason}
                  </div>
                )}

                {registration.status === 'approved' && registration.reviewedAt && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                    ✓ Approved on {new Date(registration.reviewedAt).toLocaleDateString()}
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleDownload(registration._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    <Download size={16} />
                    Download Excel
                  </button>

                  {registration.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(registration._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(registration._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionManagement;


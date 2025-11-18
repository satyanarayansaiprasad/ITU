import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Clock, CheckCircle, XCircle } from 'lucide-react';

const PlayerBeltPromotionTests = ({ playerId }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://itu-r1qa.onrender.com');

  useEffect(() => {
    if (playerId) {
      fetchTests();
    }
  }, [playerId]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/belt-promotion/player/${playerId}`);
      if (response.data.success) {
        setTests(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching belt promotion tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        icon: <Clock size={16} className="text-yellow-600" />,
        text: 'Pending',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800'
      },
      approved: {
        icon: <CheckCircle size={16} className="text-green-600" />,
        text: 'Pass',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800'
      },
      rejected: {
        icon: <XCircle size={16} className="text-red-600" />,
        text: 'Fail',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${config.bgColor} ${config.textColor}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading belt promotion tests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="text-blue-600" size={28} />
        <h2 className="text-2xl font-bold text-gray-900">Belt Promotion Tests</h2>
      </div>

      {tests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Trophy size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No belt promotion tests found</p>
          <p className="text-sm text-gray-500 mt-2">Your union will submit tests for you when ready.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Player Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Test
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Submitted Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tests.map((test, index) => (
                  <tr key={test._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {test.playerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{test.currentBelt}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-semibold text-blue-600">{test.applyingBelt}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(test.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(test.submittedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {tests.some(test => test.status === 'rejected' && test.rejectionReason) && (
            <div className="p-4 bg-red-50 border-t border-red-200">
              <p className="text-sm font-semibold text-red-800 mb-2">Rejection Reasons:</p>
              {tests
                .filter(test => test.status === 'rejected' && test.rejectionReason)
                .map((test, index) => (
                  <div key={index} className="text-sm text-red-700 mb-1">
                    <strong>{test.applyingBelt}:</strong> {test.rejectionReason}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerBeltPromotionTests;


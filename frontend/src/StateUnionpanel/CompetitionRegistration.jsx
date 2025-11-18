import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Trophy, Calendar, MapPin, Users, Save, History, CheckCircle, XCircle, Clock } from 'lucide-react';

const CompetitionRegistration = ({ unionId }) => {
  const [selectedCompetition, setSelectedCompetition] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [availableCompetitions, setAvailableCompetitions] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [existingRegistrations, setExistingRegistrations] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://itu-r1qa.onrender.com');

  useEffect(() => {
    if (unionId) {
      fetchCompetitions();
      fetchPlayers();
      fetchExistingRegistrations();
    }
  }, [unionId]);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/competition/available`);
      if (response.data.success) {
        setAvailableCompetitions(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching competitions:', error);
      toast.error('Failed to load competitions');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/unions/${unionId}/players`);
      if (response.data.success) {
        setAvailablePlayers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
      toast.error('Failed to load players');
    }
  };

  const fetchExistingRegistrations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/competition/union/${unionId}`);
      if (response.data.success) {
        setExistingRegistrations(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching existing registrations:', error);
    }
  };

  const togglePlayer = (playerId) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    } else {
      setSelectedPlayers([...selectedPlayers, playerId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCompetition) {
      toast.error('Please select a competition');
      return;
    }

    if (selectedPlayers.length === 0) {
      toast.error('Please select at least one player');
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/competition/submit`,
        {
          unionId,
          competitionId: selectedCompetition,
          playerIds: selectedPlayers
        }
      );

      if (response.data.success) {
        toast.success('Competition registration submitted successfully!');
        setSelectedCompetition('');
        setSelectedPlayers([]);
        fetchCompetitions(); // Refresh list
        fetchExistingRegistrations(); // Refresh registrations
      }
    } catch (error) {
      console.error('Error submitting competition registration:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to submit competition registration';
      console.error('Full error response:', error.response?.data);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="text-yellow-600" size={28} />
          Competition Registration
        </h2>
        <p className="text-gray-600 mt-2">Register your players for upcoming competitions</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Competition Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Competition * (Events, Training, Competitions)
          </label>
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading competitions...</div>
          ) : availableCompetitions.length === 0 ? (
            <div className="p-4 text-center text-gray-500 border border-gray-300 rounded-md">
              No competitions available at the moment
            </div>
          ) : (
            <select
              value={selectedCompetition}
              onChange={(e) => setSelectedCompetition(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- Select Competition --</option>
              {availableCompetitions.map((competition) => (
                <option key={competition._id} value={competition._id}>
                  {competition.title} ({competition.category})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Player Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Players * ({selectedPlayers.length} selected)
          </label>
          <div className="border border-gray-300 rounded-md max-h-64 overflow-y-auto bg-white">
            {availablePlayers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No players available</div>
            ) : (
              <div className="p-2">
                {availablePlayers.map((player) => (
                  <label
                    key={player._id}
                    className="flex items-center p-2 hover:bg-blue-50 cursor-pointer rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPlayers.includes(player._id)}
                      onChange={() => togglePlayer(player._id)}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{player.name}</div>
                      <div className="text-sm text-gray-500">
                        ID: {player.playerId} | Belt: {player.beltLevel || 'N/A'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !selectedCompetition || selectedPlayers.length === 0}
          className="flex items-center gap-2 px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {submitting ? 'Submitting...' : 'Submit Registration'}
        </button>
      </form>

      {/* Existing Registrations */}
      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <History size={20} />
            Registration History
          </h3>
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {showHistory ? 'Hide' : 'Show'} History
          </button>
        </div>

        {showHistory && (
          <div className="space-y-4">
            {existingRegistrations.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No registrations yet</p>
            ) : (
              existingRegistrations.map((registration) => {
                const getStatusIcon = () => {
                  if (registration.status === 'approved') return <CheckCircle className="text-green-600" size={20} />;
                  if (registration.status === 'rejected') return <XCircle className="text-red-600" size={20} />;
                  return <Clock className="text-yellow-600" size={20} />;
                };
                const getStatusColor = () => {
                  if (registration.status === 'approved') return 'bg-green-100 text-green-800';
                  if (registration.status === 'rejected') return 'bg-red-100 text-red-800';
                  return 'bg-yellow-100 text-yellow-800';
                };

                return (
                  <div key={registration._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon()}
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}>
                          {registration.status.toUpperCase()}
                        </span>
                        <span className="font-semibold">{registration.competitionTitle}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(registration.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>{registration.players.length}</strong> player(s) registered
                    </div>
                    {registration.status === 'rejected' && registration.rejectionReason && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                        <strong>Rejection Reason:</strong> {registration.rejectionReason}
                      </div>
                    )}
                    {registration.status === 'approved' && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                        ✓ Registration approved
                      </div>
                    )}
                    {registration.status === 'pending' && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                        ⏳ Waiting for admin approval
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionRegistration;


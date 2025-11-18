import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, X, Users, Award, Save, History, CheckCircle, XCircle, Clock } from 'lucide-react';

const BELT_LEVELS = [
  'Yellow',
  'Yellow One',
  'Green',
  'Green One',
  'Blue',
  'Blue One',
  'Red',
  'Red One',
  '1st Dan Black Belt',
  '2nd Dan Black Belt',
  '3rd Dan Black Belt',
  '4th Dan Black Belt',
  '5th Dan Black Belt',
  '6th Dan Black Belt',
  '7th Dan Black Belt',
  '8th Dan Black Belt',
  '9th Dan Black Belt'
];

const BeltPromotionForm = ({ unionId }) => {
  const [tests, setTests] = useState([{ beltLevel: '', players: [] }]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://itu-r1qa.onrender.com');

  useEffect(() => {
    fetchPlayers();
    fetchSubmissions();
  }, [unionId]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/user/unions/${unionId}/players`);
      if (response.data.success) {
        setAvailablePlayers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
      toast.error('Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/belt-promotion/union/${unionId}`);
      if (response.data.success) {
        setSubmissions(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const addTest = () => {
    setTests([...tests, { beltLevel: '', players: [] }]);
  };

  const removeTest = (index) => {
    if (tests.length > 1) {
      setTests(tests.filter((_, i) => i !== index));
    }
  };

  const updateBeltLevel = (index, beltLevel) => {
    const updatedTests = [...tests];
    updatedTests[index].beltLevel = beltLevel;
    setTests(updatedTests);
  };

  const togglePlayer = (testIndex, playerId) => {
    const updatedTests = [...tests];
    const test = updatedTests[testIndex];
    
    if (test.players.includes(playerId)) {
      test.players = test.players.filter(id => id !== playerId);
    } else {
      test.players.push(playerId);
    }
    
    setTests(updatedTests);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    for (let i = 0; i < tests.length; i++) {
      if (!tests[i].beltLevel) {
        toast.error(`Please select a belt level for test ${i + 1}`);
        return;
      }
      if (tests[i].players.length === 0) {
        toast.error(`Please select at least one player for test ${i + 1}`);
        return;
      }
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/belt-promotion/submit`,
        { unionId, tests }
      );

      if (response.data.success) {
        toast.success('Belt promotion test submitted successfully!');
        setTests([{ beltLevel: '', players: [] }]);
        fetchSubmissions(); // Refresh submissions list
      }
    } catch (error) {
      console.error('Error submitting belt promotion:', error);
      toast.error(error.response?.data?.error || 'Failed to submit belt promotion test');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Award className="text-blue-600" size={28} />
          Belt Promotion Test
        </h2>
        <p className="text-gray-600 mt-2">Submit belt promotion tests for your players</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {tests.map((test, testIndex) => (
          <div key={testIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Test {testIndex + 1}</h3>
              {tests.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTest(testIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Belt Level Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Belt Level *
                </label>
                <select
                  value={test.beltLevel}
                  onChange={(e) => updateBeltLevel(testIndex, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">-- Select Belt Level --</option>
                  {BELT_LEVELS.map((belt) => (
                    <option key={belt} value={belt}>{belt}</option>
                  ))}
                </select>
              </div>

              {/* Player Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Players * ({test.players.length} selected)
                </label>
                <div className="border border-gray-300 rounded-md max-h-48 overflow-y-auto bg-white">
                  {loading ? (
                    <div className="p-4 text-center text-gray-500">Loading players...</div>
                  ) : availablePlayers.length === 0 ? (
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
                            checked={test.players.includes(player._id)}
                            onChange={() => togglePlayer(testIndex, player._id)}
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{player.name}</div>
                            <div className="text-sm text-gray-500">
                              ID: {player.playerId} | Current Belt: {player.beltLevel || 'N/A'}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={addTest}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <Plus size={18} />
            Add Another Test
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={18} />
            {submitting ? 'Submitting...' : 'Submit All Tests'}
          </button>
        </div>
      </form>

      {/* Submission History */}
      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <History size={20} />
            Submission History
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
            {submissions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No submissions yet</p>
            ) : (
              submissions.map((submission) => {
                const totalStudents = submission.tests.reduce((sum, test) => sum + test.players.length, 0);
                const getStatusIcon = () => {
                  if (submission.status === 'approved') return <CheckCircle className="text-green-600" size={20} />;
                  if (submission.status === 'rejected') return <XCircle className="text-red-600" size={20} />;
                  return <Clock className="text-yellow-600" size={20} />;
                };
                const getStatusColor = () => {
                  if (submission.status === 'approved') return 'bg-green-100 text-green-800';
                  if (submission.status === 'rejected') return 'bg-red-100 text-red-800';
                  return 'bg-yellow-100 text-yellow-800';
                };

                return (
                  <div key={submission._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon()}
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}>
                          {submission.status.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>{submission.tests.length}</strong> test(s) • <strong>{totalStudents}</strong> student(s)
                    </div>
                    {submission.status === 'rejected' && submission.rejectionReason && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                        <strong>Rejection Reason:</strong> {submission.rejectionReason}
                      </div>
                    )}
                    {submission.status === 'approved' && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                        ✓ All player belt levels have been updated
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

export default BeltPromotionForm;


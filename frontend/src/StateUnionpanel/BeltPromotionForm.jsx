import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, X, Users, Award, Save, History, CheckCircle, XCircle, Clock, Search, Filter, CheckSquare, Square, User } from 'lucide-react';

const BELT_LEVELS = [
  'White',
  'White One',
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBeltFilter, setSelectedBeltFilter] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://itu-f4bn.onrender.com');

  useEffect(() => {
    fetchPlayers();
    fetchSubmissions();
  }, [unionId]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/user/unions/${unionId}/players?limit=1000`);
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
    setTests(prev => prev.map((t, i) => i === index ? { ...t, beltLevel } : t));
  };

  const togglePlayer = (testIndex, playerId) => {
    setTests(prevTests =>
      prevTests.map((test, i) => {
        if (i !== testIndex) return test;
        const exists = test.players.includes(playerId);
        return {
          ...test,
          players: exists
            ? test.players.filter(id => id !== playerId)
            : [...test.players, playerId]
        };
      })
    );
  };

  const selectAllFiltered = (testIndex, filteredPlayerIds) => {
    setTests(prevTests =>
      prevTests.map((test, i) => {
        if (i !== testIndex) return test;
        const merged = Array.from(new Set([...test.players, ...filteredPlayerIds]));
        return { ...test, players: merged };
      })
    );
  };

  const deselectAllFiltered = (testIndex, filteredPlayerIds) => {
    setTests(prevTests =>
      prevTests.map((test, i) => {
        if (i !== testIndex) return test;
        const filteredSet = new Set(filteredPlayerIds);
        return {
          ...test,
          players: test.players.filter(id => !filteredSet.has(id))
        };
      })
    );
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

  // Filter available players by search query and belt level
  const filteredPlayers = availablePlayers.filter((player) => {
    const matchesSearch =
      !searchQuery.trim() ||
      player.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.playerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBelt =
      !selectedBeltFilter ||
      player.beltLevel?.toLowerCase() === selectedBeltFilter.toLowerCase();

    return matchesSearch && matchesBelt;
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
          <Award className="text-blue-600" size={28} />
          Belt Promotion Test
        </h2>
        <p className="text-gray-600 mt-1">Submit belt promotion tests for your approved players</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {tests.map((test, testIndex) => {
          const filteredIds = filteredPlayers.map(p => p._id);
          const allFilteredSelected = filteredIds.length > 0 && filteredIds.every(id => test.players.includes(id));

          return (
            <div key={testIndex} className="border border-gray-200 rounded-xl p-6 bg-gray-50 shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                    {testIndex + 1}
                  </span>
                  Test Category #{testIndex + 1}
                </h3>
                {tests.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTest(testIndex)}
                    className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50"
                    title="Remove test category"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Belt Level Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Target Belt Level *
                  </label>
                  <select
                    value={test.beltLevel}
                    onChange={(e) => updateBeltLevel(testIndex, e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium shadow-sm"
                    required
                  >
                    <option value="">-- Select Target Belt Level --</option>
                    {BELT_LEVELS.map((belt) => (
                      <option key={belt} value={belt}>{belt}</option>
                    ))}
                  </select>
                </div>

                {/* Player Selection Section */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <Users size={18} className="text-blue-600" />
                      Select Players ({test.players.length} selected)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => allFilteredSelected ? deselectAllFiltered(testIndex, filteredIds) : selectAllFiltered(testIndex, filteredIds)}
                        className="text-xs font-semibold px-3 py-1 bg-white border border-gray-300 text-blue-700 hover:bg-blue-50 rounded-md transition-colors shadow-sm flex items-center gap-1"
                      >
                        {allFilteredSelected ? <Square size={14} /> : <CheckSquare size={14} />}
                        {allFilteredSelected ? 'Deselect All' : 'Select All Filtered'}
                      </button>
                    </div>
                  </div>

                  {/* Search and Filter Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by player name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                      />
                    </div>
                    <div className="relative">
                      <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={selectedBeltFilter}
                        onChange={(e) => setSelectedBeltFilter(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-gray-700"
                      >
                        <option value="">Filter by Current Belt (All)</option>
                        {BELT_LEVELS.map((belt) => (
                          <option key={belt} value={belt}>{belt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Player Cards Box */}
                  <div className="border border-gray-300 rounded-lg max-h-72 overflow-y-auto bg-white p-2 divide-y divide-gray-100 shadow-inner">
                    {loading ? (
                      <div className="p-8 text-center text-gray-500 flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                        <span>Loading approved players...</span>
                      </div>
                    ) : filteredPlayers.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <User size={32} className="mx-auto text-gray-300 mb-2" />
                        <p className="font-medium text-gray-700">No players found</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your search or belt filter</p>
                      </div>
                    ) : (
                      filteredPlayers.map((player) => {
                        const isSelected = test.players.includes(player._id);
                        return (
                          <label
                            key={player._id}
                            className={`flex items-center justify-between p-3 cursor-pointer rounded-lg transition-all ${
                              isSelected
                                ? 'bg-blue-50/80 border border-blue-300 shadow-sm'
                                : 'hover:bg-gray-50 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => togglePlayer(testIndex, player._id)}
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded border-gray-300 cursor-pointer"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-gray-900 text-base truncate">
                                  {player.name}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-blue-100 text-blue-800">
                                    ID: {player.playerId || 'N/A'}
                                  </span>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                                    Current: {player.beltLevel || 'White'}
                                  </span>
                                  {player.dob && (
                                    <span className="text-xs text-gray-400">
                                      DOB: {new Date(player.dob).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </label>
                        );
                      })
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-500 flex justify-between items-center px-1">
                    <span>Showing {filteredPlayers.length} of {availablePlayers.length} total players</span>
                    <span className="font-medium text-blue-700">{test.players.length} selected for this test</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={addTest}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add Another Test
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-7 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md"
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


import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const StateUnion = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('all'); // 'all', 'states', 'ut'
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // No active states - all coming soon
  const activeStatesInfo = {};

  // Fetch states from Firebase API
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ENDPOINTS.GET_ALL_STATES);
        
        if (response.data.success) {
          // Map Firebase data to component format - all states are coming soon
          const mappedStates = response.data.data.map((state, index) => {
            return {
              id: state.id || index + 1,
              name: state.name,
              districts: state.districtCount || state.districts?.length || 0,
              type: state.type,
              active: false, // All states are coming soon
              secretary: null,
              unionName: null,
              established: null
            };
          });
          setStates(mappedStates);
        }
      } catch (err) {
        console.error('Error fetching states:', err);
        setError('Failed to load states. Please try again later.');
        // Fallback to empty array
        setStates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  const activeStates = states.filter(state => state.active);
  const upcomingStates = states.filter(state => !state.active);
  
  // Filter states based on type
  const filteredUpcomingStates = useMemo(() => {
    if (filterType === 'all') return upcomingStates;
    if (filterType === 'states') return upcomingStates.filter(s => s.type === 'State');
    if (filterType === 'ut') return upcomingStates.filter(s => s.type === 'Union Territory');
    return upcomingStates;
  }, [upcomingStates, filterType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pt-[130px] sm:pt-[135px] md:pt-[140px] pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-gray-600">Loading states and districts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pt-[130px] sm:pt-[135px] md:pt-[140px] pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pt-[130px] sm:pt-[135px] md:pt-[140px] pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-extrabold text-gray-800 sm:text-5xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            State <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">Unions</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Indian Taekwondo Union - States & Union Territories Network
          </motion.p>
        </div>

        {/* Active States Section */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="mr-2">📋</span>
                Active State Unions ({activeStates.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">State</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Union Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Secretary</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Districts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {activeStates.map((state, index) => (
                    <motion.tr
                      key={state.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-orange-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/state-union/${state.name}`)}
                    >
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-800">{state.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{state.unionName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{state.secretary}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {state.districts}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Upcoming States Section */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden mb-6"
          >
            <div className="bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-bold text-white">
                Upcoming State/UT Unions ({upcomingStates.length} Total)
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterType === 'all'
                      ? 'bg-white text-gray-700'
                      : 'bg-gray-600 text-white hover:bg-gray-500'
                  }`}
                >
                  All ({upcomingStates.length})
                </button>
                <button
                  onClick={() => setFilterType('states')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterType === 'states'
                      ? 'bg-white text-gray-700'
                      : 'bg-gray-600 text-white hover:bg-gray-500'
                  }`}
                >
                  States ({upcomingStates.filter(s => s.type === 'State').length})
                </button>
                <button
                  onClick={() => setFilterType('ut')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterType === 'ut'
                      ? 'bg-white text-gray-700'
                      : 'bg-gray-600 text-white hover:bg-gray-500'
                  }`}
                >
                  UTs ({upcomingStates.filter(s => s.type === 'Union Territory').length})
                </button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredUpcomingStates.map((state, index) => (
              <motion.div
                key={state.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 p-4 text-center group cursor-pointer"
                onClick={() => navigate(`/state-union/${state.name}`)}
              >
                <div className="text-gray-600 font-medium group-hover:text-orange-600 transition-colors text-sm">
                  {state.name}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {state.districts} {state.districts === 1 ? 'District' : 'Districts'}
                </div>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <span className="inline-block bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">
                    Coming Soon
                  </span>
                  {state.type === 'Union Territory' && (
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      UT
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateUnion;

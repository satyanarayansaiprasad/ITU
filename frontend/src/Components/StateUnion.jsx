import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { Crown, Building2, Phone, MapPin } from 'lucide-react';

const StateUnion = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('all'); // 'all', 'states', 'ut'
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stateHeads, setStateHeads] = useState({}); // Map of stateName -> stateHead data
  const [districtsWithData, setDistrictsWithData] = useState({}); // Map of stateName -> boolean (has districts with data)

  // Fetch states summary from API
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ENDPOINTS.GET_STATES_SUMMARY);
        
        if (response.data.success) {
          const enrichedStates = response.data.data;
          
          setStates(enrichedStates);
          
          const headsMap = {};
          const districtsDataMap = {};
          
          enrichedStates.forEach(state => {
            if (state.stateHead) {
              headsMap[state.name] = state.stateHead;
            }
            districtsDataMap[state.name] = state.hasDistrictData;
          });
          
          setStateHeads(headsMap);
          setDistrictsWithData(districtsDataMap);
        }
      } catch (err) {
        console.error('Error fetching states summary:', err);
        setError('Failed to load states summary. Please try again later.');
        setStates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  const activeStates = states.filter(state => state.active || stateHeads[state.name]);
  const upcomingStates = states.filter(state => !state.active && !stateHeads[state.name]);
  
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
            
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[800px] border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">State</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Union Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">General Secretary</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Districts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {activeStates.map((state, index) => {
                    const stateHead = stateHeads[state.name];
                    const districtList = Array.isArray(state.districts) ? state.districts : [];
                    const displayDistricts = districtList.slice(0, 3).join(', ');
                    const remainingCount = districtList.length - 3;

                    return (
                      <motion.tr
                        key={state.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-orange-50 transition-colors cursor-pointer group"
                        onClick={() => navigate(`/state-union/${state.name}`)}
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{state.name}</span>
                            {stateHead && (
                              <span className="inline-flex w-fit items-center gap-1 px-2 py-0.5 bg-yellow-500 text-white text-[10px] font-bold rounded-full uppercase">
                                <Crown className="w-3 h-3" />
                                State Head
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm text-gray-700 font-medium line-clamp-2">
                            {state.unionName || stateHead?.name || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm text-gray-700">
                            {stateHead?.secretaryName || state.secretary || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                              {districtList.length} Districts
                            </span>
                            {districtList.length > 0 && (
                              <span className="text-xs text-gray-500 italic max-w-[200px] truncate">
                                {displayDistricts}{remainingCount > 0 ? ` +${remainingCount} more` : ''}
                              </span>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUpcomingStates.map((state, index) => {
              const stateHead = stateHeads[state.name];
              const districtList = Array.isArray(state.districts) ? state.districts : [];
              
              return (
                <motion.div
                  key={state.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-5 flex flex-col justify-between group cursor-pointer h-full"
                  onClick={() => navigate(`/state-union/${state.name}`)}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-gray-900 font-bold group-hover:text-orange-600 transition-colors text-lg">
                        {state.name}
                      </div>
                      {state.type === 'Union Territory' && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase border border-blue-100">
                          UT
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded">
                        {districtList.length} Districts
                      </span>
                      {districtsWithData[state.name] ? (
                        <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded border border-green-100 uppercase">
                          Districts Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded border border-amber-100 uppercase">
                          Coming Soon
                        </span>
                      )}
                    </div>

                    {districtList.length > 0 && (
                      <div className="text-xs text-gray-400 italic mb-4 line-clamp-2 leading-relaxed">
                        {districtList.slice(0, 8).join(', ')}{districtList.length > 8 ? '...' : ''}
                      </div>
                    )}
                  </div>

                  {/* State Head Display */}
                  {stateHead && (
                    <div className="mt-auto pt-4 border-t border-gray-50">
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Crown className="w-3.5 h-3.5 text-amber-600" />
                          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">State Head</span>
                        </div>
                        <div className="font-bold text-gray-800 text-sm mb-1">{stateHead.name}</div>
                        {stateHead.phone && (
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                            <Phone className="w-3 h-3" />
                            {stateHead.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateUnion;

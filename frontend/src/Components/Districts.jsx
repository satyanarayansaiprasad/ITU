import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const Districts = () => {
  const { stateName } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    districts: [],
    active: false,
    type: 'State',
    stateName: stateName
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch districts from Firebase API
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ENDPOINTS.GET_DISTRICTS(stateName));
        
        if (response.data.success) {
          setState({
            districts: response.data.data.districts || [],
            active: response.data.data.active || false,
            type: response.data.data.stateType || 'State',
            stateName: response.data.data.stateName || stateName
          });
        }
      } catch (err) {
        console.error('Error fetching districts:', err);
        setError('Failed to load districts. Please try again later.');
        setState({
          districts: [],
          active: false,
          type: 'State',
          stateName: stateName
        });
      } finally {
        setLoading(false);
      }
    };

    if (stateName) {
      fetchDistricts();
    }
  }, [stateName]);
  
  const getStatus = (i) => {
    if (!state.active) return 'coming-soon';
    return i % 2 === 0 ? 'active' : 'coming-soon';
  };
  
  const activeDistricts = state.districts.filter((_, i) => getStatus(i) === 'active');
  const comingDistricts = state.districts.filter((_, i) => getStatus(i) === 'coming-soon');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pt-[130px] pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-gray-600">Loading districts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pt-[130px] pb-12 px-4">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pt-[130px] pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <button onClick={() => navigate('/state-union')} className="mb-6 text-orange-600 hover:text-orange-700 font-medium">
            ← Back to States & Union Territories
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{state.stateName || stateName} Districts</h1>
          <div className="flex items-center justify-center gap-3 mb-2">
            <p className="text-xl text-gray-600">Total Districts: {state.districts.length}</p>
            {state.type === 'Union Territory' && (
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Union Territory
              </span>
            )}
          </div>
          {state.active && (
            <p className="text-sm text-green-600 font-medium">✓ Active Union</p>
          )}
        </div>

        {activeDistricts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg mb-12">
            <div className="bg-green-500 px-6 py-4 rounded-t-xl">
              <h2 className="text-2xl font-bold text-white">Active Districts ({activeDistricts.length})</h2>
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {activeDistricts.map((district, i) => (
                <div key={i} className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                  <div className="text-green-700 font-medium text-sm">{district}</div>
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded mt-2 inline-block">Active</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {comingDistricts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg mb-12">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4 rounded-t-xl">
              <h2 className="text-xl font-bold text-white">Coming Soon Districts ({comingDistricts.length})</h2>
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {comingDistricts.map((district, i) => (
                <div key={i} className="bg-white border-2 border-dashed border-amber-300 rounded-lg p-4 text-center">
                  <div className="text-gray-600 font-medium text-sm">{district}</div>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded mt-2 inline-block">Coming Soon</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Districts;


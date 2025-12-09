import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { Building2, Phone, MapPin, Crown, Award, Mail } from 'lucide-react';

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
  const [organizationsByDistrict, setOrganizationsByDistrict] = useState({});
  const [stateHead, setStateHead] = useState(null);
  
  // Fetch districts from Firebase API
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ENDPOINTS.GET_DISTRICTS(stateName));
        
        if (response.data.success) {
          const districts = response.data.data.districts || [];
          setState({
            districts: districts,
            active: response.data.data.active || false,
            type: response.data.data.stateType || 'State',
            stateName: response.data.data.stateName || stateName
          });
          
          // Fetch state head
          try {
            const orgResponse = await axios.get(API_ENDPOINTS.GET_ORGANIZATIONS_BY_STATE(stateName));
            if (orgResponse.data.success) {
              const head = orgResponse.data.data.find(org => org.isStateHead);
              if (head) {
                setStateHead(head);
              }
            }
          } catch (err) {
            console.error(`Error fetching state head for ${stateName}:`, err);
          }
          
          // Fetch organizations for each district
          const orgsMap = {};
          for (const district of districts) {
            try {
              const orgResponse = await axios.get(
                API_ENDPOINTS.GET_ORGANIZATIONS_BY_DISTRICT(stateName, district)
              );
              if (orgResponse.data.success && orgResponse.data.data.length > 0) {
                orgsMap[district] = orgResponse.data.data;
              }
            } catch (err) {
              console.error(`Error fetching organizations for ${district}:`, err);
            }
          }
          setOrganizationsByDistrict(orgsMap);
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
  
  // Determine district status based on actual data availability
  const getDistrictStatus = (districtName) => {
    // Check if district has organizations
    return organizationsByDistrict[districtName] && organizationsByDistrict[districtName].length > 0 
      ? 'active' 
      : 'coming-soon';
  };
  
  const activeDistricts = state.districts.filter(district => getDistrictStatus(district) === 'active');
  const comingDistricts = state.districts.filter(district => getDistrictStatus(district) === 'coming-soon');

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pt-[100px] sm:pt-[120px] md:pt-[130px] pb-8 sm:pb-12 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <button onClick={() => navigate('/state-union')} className="mb-6 text-orange-600 hover:text-orange-700 font-medium">
            ← Back to States & Union Territories
          </button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{state.stateName || stateName} Districts</h1>
          <div className="flex items-center justify-center gap-3 mb-2">
          <p className="text-lg sm:text-xl text-gray-600">Total Districts: {state.districts.length}</p>
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

        {/* State Head Section */}
        {stateHead && (
          <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden relative">
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                <Crown className="w-5 h-5" />
                <span className="font-bold text-sm">State Head</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {stateHead.generalSecretaryImage && (
                  <div className="flex-shrink-0">
                    <div className="text-center">
                      <img
                        src={stateHead.generalSecretaryImage.startsWith('http') ? stateHead.generalSecretaryImage : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/${stateHead.generalSecretaryImage}`}
                        alt="General Secretary"
                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg object-cover border-4 border-yellow-500 shadow-xl mx-auto"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <p className="text-sm font-semibold text-gray-700 mt-3">{stateHead.secretaryName || 'General Secretary'}</p>
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                    {stateHead.name}
                  </h3>
                  {stateHead.state && (
                    <p className="text-base text-gray-600 font-medium mb-4">
                      {stateHead.state}
                    </p>
                  )}
                  {stateHead.headOfficeAddress && (
                    <div className="flex items-start gap-2 text-gray-700 mb-4">
                      <MapPin className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                      <span className="font-semibold leading-relaxed">{stateHead.headOfficeAddress}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {stateHead.phone && (
                      <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                        <div className="bg-green-200 rounded-lg p-2">
                          <Phone className="w-5 h-5 text-green-700" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Contact Phone</p>
                          <a href={`tel:${stateHead.phone}`} className="text-base font-bold text-gray-800 hover:text-green-700 transition-colors">
                            {stateHead.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    {stateHead.email && (
                      <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
                        <div className="bg-purple-200 rounded-lg p-2">
                          <Mail className="w-5 h-5 text-purple-700" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Email Address</p>
                          <a href={`mailto:${stateHead.email}`} className="text-base font-bold text-gray-800 hover:text-purple-700 transition-colors break-all">
                            {stateHead.email}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeDistricts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg mb-12">
            <div className="bg-green-500 px-4 sm:px-6 py-3 sm:py-4 rounded-t-xl">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Active Districts ({activeDistricts.length})</h2>
            </div>
            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {activeDistricts.map((district, i) => (
                <div 
                  key={i} 
                  onClick={() => navigate(`/state-union/${encodeURIComponent(stateName)}/district/${encodeURIComponent(district)}`)}
                  className="bg-green-50 border-2 border-green-200 rounded-lg p-4 cursor-pointer hover:border-green-400 hover:shadow-md transition-all"
                >
                  <div className="text-green-700 font-medium text-sm mb-2 text-center">{district}</div>
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded mb-3 inline-block">Active</span>
                  
                  <p className="text-xs text-gray-500 mt-3 text-center">Click to view details</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {comingDistricts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg mb-12">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-4 sm:px-6 py-3 sm:py-4 rounded-t-xl">
              <h2 className="text-lg sm:text-xl font-bold text-white">Coming Soon Districts ({comingDistricts.length})</h2>
            </div>
            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {comingDistricts.map((district, i) => (
                <div 
                  key={i} 
                  onClick={() => navigate(`/state-union/${encodeURIComponent(stateName)}/district/${encodeURIComponent(district)}`)}
                  className="bg-white border-2 border-dashed border-amber-300 rounded-lg p-4 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all"
                >
                  <div className="text-gray-600 font-medium text-sm mb-2 text-center">{district}</div>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded mb-3 inline-block">Coming Soon</span>
                  
                  <p className="text-xs text-gray-500 mt-3 text-center">Click to view details</p>
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


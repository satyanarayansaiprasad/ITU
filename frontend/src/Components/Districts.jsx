import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { Building2, Phone, MapPin, Crown, Award } from 'lucide-react';

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
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeDistricts.map((district, i) => (
                <div key={i} className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="text-green-700 font-medium text-sm mb-2 text-center">{district}</div>
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded mb-3 inline-block">Active</span>
                  
                  {/* District Head - Show First */}
                  {organizationsByDistrict[district] && organizationsByDistrict[district].find(org => org.isDistrictHead) && (
                    <div className="mt-3 mb-3 border-t border-green-200 pt-3">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="w-4 h-4" />
                          <span className="text-xs font-semibold uppercase">District Head</span>
                        </div>
                        {(() => {
                          const head = organizationsByDistrict[district].find(org => org.isDistrictHead);
                          return (
                            <>
                              <div className="font-bold text-sm mb-1">{head.name}</div>
                              {head.phone && <div className="text-xs opacity-90">{head.phone}</div>}
                              {head.headOfficeAddress && <div className="text-xs opacity-90 mt-1">{head.headOfficeAddress}</div>}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Other Organizations */}
                  {organizationsByDistrict[district] && organizationsByDistrict[district].filter(org => !org.isDistrictHead).length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-green-200 pt-3">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Other Organizations:</p>
                      {organizationsByDistrict[district].filter(org => !org.isDistrictHead).map((org, idx) => (
                        <div key={idx} className="bg-white rounded p-2 text-xs">
                          <div className="flex items-start gap-2 mb-1">
                            <Building2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="font-semibold text-gray-800">{org.name}</div>
                          </div>
                          {org.phone && (
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                              <Phone className="w-3 h-3 text-green-600 flex-shrink-0" />
                              <span>{org.phone}</span>
                            </div>
                          )}
                          {org.headOfficeAddress && (
                            <div className="flex items-start gap-2 text-gray-600">
                              <MapPin className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{org.headOfficeAddress}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comingDistricts.map((district, i) => (
                <div key={i} className="bg-white border-2 border-dashed border-amber-300 rounded-lg p-4">
                  <div className="text-gray-600 font-medium text-sm mb-2 text-center">{district}</div>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded mb-3 inline-block">Coming Soon</span>
                  
                  {/* District Head - Show First */}
                  {organizationsByDistrict[district] && organizationsByDistrict[district].find(org => org.isDistrictHead) && (
                    <div className="mt-3 mb-3 border-t border-amber-200 pt-3">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="w-4 h-4" />
                          <span className="text-xs font-semibold uppercase">District Head</span>
                        </div>
                        {(() => {
                          const head = organizationsByDistrict[district].find(org => org.isDistrictHead);
                          return (
                            <>
                              <div className="font-bold text-sm mb-1">{head.name}</div>
                              {head.phone && <div className="text-xs opacity-90">{head.phone}</div>}
                              {head.headOfficeAddress && <div className="text-xs opacity-90 mt-1">{head.headOfficeAddress}</div>}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Other Organizations */}
                  {organizationsByDistrict[district] && organizationsByDistrict[district].filter(org => !org.isDistrictHead).length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-amber-200 pt-3">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Other Organizations:</p>
                      {organizationsByDistrict[district].filter(org => !org.isDistrictHead).map((org, idx) => (
                        <div key={idx} className="bg-gray-50 rounded p-2 text-xs">
                          <div className="flex items-start gap-2 mb-1">
                            <Building2 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="font-semibold text-gray-800">{org.name}</div>
                          </div>
                          {org.phone && (
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                              <Phone className="w-3 h-3 text-amber-600 flex-shrink-0" />
                              <span>{org.phone}</span>
                            </div>
                          )}
                          {org.headOfficeAddress && (
                            <div className="flex items-start gap-2 text-gray-600">
                              <MapPin className="w-3 h-3 text-amber-600 mt-0.5 flex-shrink-0" />
                              <span>{org.headOfficeAddress}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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


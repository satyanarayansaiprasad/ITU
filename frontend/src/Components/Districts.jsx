import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Districts = () => {
  const { stateName } = useParams();
  const navigate = useNavigate();
  
  const districtData = {
    'Maharashtra': { districts: ['Mumbai', 'Pune', 'Nagpur', 'Aurangabad', 'Nashik', 'Solapur'], active: true },
    'Delhi': { districts: ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi'], active: true },
    'Karnataka': { districts: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'], active: true },
    'Tamil Nadu': { districts: ['Chennai', 'Coimbatore', 'Madurai', 'Trichy'], active: true },
    'Kerala': { districts: ['Thiruvananthapuram', 'Kollam', 'Kochi', 'Kozhikode'], active: true },
    'Gujarat': { districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'], active: true }
  };

  const state = districtData[stateName] || { districts: ['District 1', 'District 2', 'District 3'], active: false };
  
  const getStatus = (i) => {
    if (!state.active) return 'coming-soon';
    return i % 2 === 0 ? 'active' : 'coming-soon';
  };
  
  const activeDistricts = state.districts.filter((_, i) => getStatus(i) === 'active');
  const comingDistricts = state.districts.filter((_, i) => getStatus(i) === 'coming-soon');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pt-[130px] pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <button onClick={() => navigate('/state-union')} className="mb-6 text-orange-600 hover:text-orange-700">
            ← Back to States
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{stateName} Districts</h1>
          <p className="text-xl text-gray-600">Total Districts: {state.districts.length}</p>
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


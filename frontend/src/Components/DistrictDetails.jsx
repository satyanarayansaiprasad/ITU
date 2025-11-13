import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { Building2, Phone, MapPin, Award, User, Mail, ArrowLeft, ExternalLink, Globe, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const DistrictDetails = () => {
  const { stateName, districtName } = useParams();
  const navigate = useNavigate();
  const [districtHead, setDistrictHead] = useState(null);
  const [unions, setUnions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnion, setSelectedUnion] = useState(null);

  useEffect(() => {
    const fetchDistrictData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          API_ENDPOINTS.GET_ORGANIZATIONS_BY_DISTRICT(stateName, districtName)
        );

        if (response.data.success) {
          const organizations = response.data.data || [];
          
          // Find district head
          const head = organizations.find(org => org.isDistrictHead);
          setDistrictHead(head || null);
          
          // Get other unions (excluding district head)
          const otherUnions = organizations.filter(org => !org.isDistrictHead);
          setUnions(otherUnions);
        }
      } catch (error) {
        console.error('Error fetching district data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (stateName && districtName) {
      fetchDistrictData();
    }
  }, [stateName, districtName]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
    return `${baseUrl}/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pt-[130px] pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-gray-600">Loading district information...</p>
          </div>
        </div>
      </div>
    );
  }

  const hasData = districtHead || unions.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pt-[130px] pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(`/state-union/${stateName}`)}
            className="mb-4 flex items-center text-orange-600 hover:text-orange-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Districts
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{districtName}</h1>
          <p className="text-xl text-gray-600">{stateName}</p>
        </motion.div>

        {!hasData ? (
          // No data available - Show contact us message
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <Building2 className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  No Organizations Available
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  There are currently no organizations registered in this district.
                </p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Join Our Organization</h3>
                <p className="text-lg mb-6 opacity-90">
                  Be a part of the Indian Taekwondo Union. Register your organization today!
                </p>
                <button
                  onClick={() => navigate('/forms')}
                  className="bg-white text-orange-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto"
                >
                  <ExternalLink className="w-5 h-5" />
                  Fill Affiliation Form
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* District Head Section */}
            {districtHead ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-white" />
                    <h2 className="text-2xl font-bold text-white">District Head</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {districtHead.generalSecretaryImage && (
                      <div className="flex-shrink-0">
                        <img
                          src={getImageUrl(districtHead.generalSecretaryImage)}
                          alt="Secretary"
                          className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{districtHead.name}</h3>
                      <div className="space-y-2">
                        {districtHead.phone && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-5 h-5 text-orange-600" />
                            <span>{districtHead.phone}</span>
                          </div>
                        )}
                        {districtHead.headOfficeAddress && (
                          <div className="flex items-start gap-2 text-gray-600">
                            <MapPin className="w-5 h-5 text-orange-600 mt-1" />
                            <span>{districtHead.headOfficeAddress}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg mb-8 p-6 text-center"
              >
                <div className="bg-amber-100 border-2 border-amber-300 rounded-lg p-6">
                  <p className="text-lg font-semibold text-amber-800">District Head - Coming Soon</p>
                </div>
              </motion.div>
            )}

            {/* Unions List */}
            {unions.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
                  <h2 className="text-2xl font-bold text-white">
                    Available Unions ({unions.length})
                  </h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unions.map((union, index) => (
                    <motion.div
                      key={union._id || index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      onClick={() => setSelectedUnion(union)}
                      className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-orange-500 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        {union.generalSecretaryImage ? (
                          <img
                            src={getImageUrl(union.generalSecretaryImage)}
                            alt="Secretary"
                            className="w-16 h-16 rounded-full object-cover border-2 border-orange-500"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                            <User className="w-8 h-8 text-orange-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 mb-1">{union.name}</h3>
                          {union.phone && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {union.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      {union.headOfficeAddress && (
                        <p className="text-sm text-gray-600 flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{union.headOfficeAddress}</span>
                        </p>
                      )}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className="text-xs text-orange-600 font-semibold">Click to view details →</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-8 text-center"
              >
                <p className="text-lg text-gray-600 mb-6">No other unions available in this district.</p>
                <button
                  onClick={() => navigate('/forms')}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-colors"
                >
                  Join Our Organization
                </button>
              </motion.div>
            )}
          </>
        )}

        {/* Union Detail Modal */}
        {selectedUnion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedUnion(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Union Details</h2>
                <button
                  onClick={() => setSelectedUnion(null)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                {/* Secretary Photo and Organization Name */}
                <div className="flex flex-col md:flex-row gap-6 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex flex-col items-center md:items-start flex-shrink-0">
                    {selectedUnion.generalSecretaryImage ? (
                      <div className="text-center">
                        <img
                          src={getImageUrl(selectedUnion.generalSecretaryImage)}
                          alt="Secretary"
                          className="w-40 h-40 rounded-lg object-cover border-4 border-orange-500 shadow-lg mx-auto"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-40 h-40 rounded-lg bg-orange-100 flex items-center justify-center border-4 border-orange-500 shadow-lg mx-auto" style={{ display: 'none' }}>
                          <User className="w-20 h-20 text-orange-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-700 mt-3">Secretary Photo</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-40 h-40 rounded-lg bg-orange-100 flex items-center justify-center border-4 border-orange-500 shadow-lg mx-auto">
                          <User className="w-20 h-20 text-orange-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-700 mt-3">Secretary Photo</p>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">{selectedUnion.name}</h3>
                    <p className="text-lg text-gray-600 mb-4">Organization Details</p>
                    {selectedUnion.district && selectedUnion.state && (
                      <p className="text-sm text-gray-500">
                        {selectedUnion.district}, {selectedUnion.state}
                      </p>
                    )}
                  </div>
                </div>

                {/* All Organization Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Secretary Name */}
                  {selectedUnion.secretaryName && (
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                      <User className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">Secretary Name</p>
                        <p className="text-lg font-semibold text-gray-800">{selectedUnion.secretaryName}</p>
                      </div>
                    </div>
                  )}

                  {/* President Name */}
                  {selectedUnion.presidentName && (
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <User className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">President Name</p>
                        <p className="text-lg font-semibold text-gray-800">{selectedUnion.presidentName}</p>
                      </div>
                    </div>
                  )}

                  {/* Contact Phone */}
                  {selectedUnion.phone && (
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                      <Phone className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">Contact Phone</p>
                        <a href={`tel:${selectedUnion.phone}`} className="text-lg font-semibold text-gray-800 hover:text-green-600">
                          {selectedUnion.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Contact Phone (Alternative) */}
                  {selectedUnion.contactPhone && selectedUnion.contactPhone !== selectedUnion.phone && (
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                      <Phone className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">Alternate Contact</p>
                        <a href={`tel:${selectedUnion.contactPhone}`} className="text-lg font-semibold text-gray-800 hover:text-green-600">
                          {selectedUnion.contactPhone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {selectedUnion.email && (
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                      <Mail className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                        <a href={`mailto:${selectedUnion.email}`} className="text-lg font-semibold text-gray-800 hover:text-purple-600 break-all">
                          {selectedUnion.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Contact Email (Alternative) */}
                  {selectedUnion.contactEmail && selectedUnion.contactEmail !== selectedUnion.email && (
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                      <Mail className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">Contact Email</p>
                        <a href={`mailto:${selectedUnion.contactEmail}`} className="text-lg font-semibold text-gray-800 hover:text-purple-600 break-all">
                          {selectedUnion.contactEmail}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Head Office Address */}
                  {selectedUnion.headOfficeAddress && (
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 md:col-span-2">
                      <MapPin className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">Head Office Address</p>
                        <p className="text-lg text-gray-800">{selectedUnion.headOfficeAddress}</p>
                      </div>
                    </div>
                  )}

                  {/* Address (if different from head office) */}
                  {selectedUnion.address && selectedUnion.address !== selectedUnion.headOfficeAddress && (
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 md:col-span-2">
                      <MapPin className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
                        <p className="text-lg text-gray-800">{selectedUnion.address}</p>
                      </div>
                    </div>
                  )}

                  {/* Official Website */}
                  {selectedUnion.officialWebsite && (
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200 md:col-span-2">
                      <Globe className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">Official Website</p>
                        <a 
                          href={selectedUnion.officialWebsite.startsWith('http') ? selectedUnion.officialWebsite : `https://${selectedUnion.officialWebsite}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-semibold text-indigo-600 hover:text-indigo-800 break-all flex items-center gap-2"
                        >
                          {selectedUnion.officialWebsite}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Established Year */}
                  {selectedUnion.establishedDate && (
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                      <Calendar className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">Established Year</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {new Date(selectedUnion.establishedDate).getFullYear()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* About Union */}
                  {selectedUnion.aboutUnion && (
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border border-teal-200 md:col-span-2">
                      <Building2 className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">About Organization</p>
                        <p className="text-lg text-gray-800 whitespace-pre-wrap">{selectedUnion.aboutUnion}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DistrictDetails;


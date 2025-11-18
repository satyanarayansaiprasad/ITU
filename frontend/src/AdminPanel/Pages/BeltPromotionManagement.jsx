import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Download, CheckCircle, XCircle, Award, Users, Calendar } from 'lucide-react';
import { indianStatesAndDistricts, getDistrictsForState } from '../../data/indianStatesDistricts';

const BeltPromotionManagement = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUnion, setSelectedUnion] = useState('');
  const [unions, setUnions] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [districts, setDistricts] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://itu-r1qa.onrender.com');

  const states = Object.keys(indianStatesAndDistricts);

  useEffect(() => {
    if (selectedState) {
      const districtsList = getDistrictsForState(selectedState) || [];
      setDistricts(districtsList);
      setSelectedDistrict('');
      setSelectedUnion('');
      setUnions([]);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedState && selectedDistrict) {
      fetchUnions();
    }
  }, [selectedState, selectedDistrict]);

  useEffect(() => {
    if (selectedState || selectedDistrict || selectedUnion) {
      fetchPromotions();
    }
  }, [selectedState, selectedDistrict, selectedUnion]);

  const fetchUnions = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/user/organizations/${selectedState}/${selectedDistrict}`
      );
      if (response.data.success) {
        setUnions(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching unions:', error);
      toast.error('Failed to load unions');
    }
  };

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedState) params.state = selectedState;
      if (selectedDistrict) params.district = selectedDistrict;
      if (selectedUnion) params.unionId = selectedUnion;

      const response = await axios.get(`${API_BASE_URL}/api/belt-promotion/admin/list`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.data.success) {
        setPromotions(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
      toast.error('Failed to load belt promotion tests');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (promotionId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/belt-promotion/admin/${promotionId}/download`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `belt-promotion-${promotionId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Excel file downloaded successfully');
    } catch (error) {
      console.error('Error downloading Excel:', error);
      toast.error('Failed to download Excel file');
    }
  };

  const handleApprove = async (promotionId) => {
    if (!window.confirm('Are you sure you want to approve this belt promotion test? This will update all players\' belt levels.')) {
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/belt-promotion/admin/${promotionId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Belt promotion test approved and player belt levels updated');
        fetchPromotions();
      }
    } catch (error) {
      console.error('Error approving promotion:', error);
      toast.error(error.response?.data?.error || 'Failed to approve belt promotion');
    }
  };

  const handleReject = async (promotionId) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/belt-promotion/admin/${promotionId}/reject`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Belt promotion test rejected');
        fetchPromotions();
      }
    } catch (error) {
      console.error('Error rejecting promotion:', error);
      toast.error(error.response?.data?.error || 'Failed to reject belt promotion');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const getTotalStudents = (promotion) => {
    return promotion.tests.reduce((total, test) => total + test.players.length, 0);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Award className="text-blue-600" size={28} />
          Belt Promotion Test Management
        </h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedState}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">All Districts</option>
              {districts.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Union</label>
            <select
              value={selectedUnion}
              onChange={(e) => setSelectedUnion(e.target.value)}
              disabled={!selectedDistrict}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">All Unions</option>
              {unions.map((union) => (
                <option key={union._id} value={union._id}>{union.name || union.secretaryName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Promotions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading belt promotion tests...</p>
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Award size={48} className="mx-auto mb-4 text-gray-400" />
            <p>No belt promotion tests found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {promotions.map((promotion) => (
              <div key={promotion._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{promotion.unionName}</h3>
                    <p className="text-sm text-gray-600">
                      {promotion.state} {promotion.district && `• ${promotion.district}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted: {new Date(promotion.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(promotion.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={16} className="text-gray-400" />
                    <span><strong>{getTotalStudents(promotion)}</strong> students</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award size={16} className="text-gray-400" />
                    <span><strong>{promotion.tests.length}</strong> test(s)</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Test Details:</p>
                  <div className="space-y-2">
                    {promotion.tests.map((test, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                        <span className="font-medium">{test.beltLevel}:</span> {test.players.length} player(s)
                      </div>
                    ))}
                  </div>
                </div>

                {promotion.status === 'rejected' && promotion.rejectionReason && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                    <strong>Rejection Reason:</strong> {promotion.rejectionReason}
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleDownload(promotion._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    <Download size={16} />
                    Download Excel
                  </button>

                  {promotion.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(promotion._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(promotion._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BeltPromotionManagement;


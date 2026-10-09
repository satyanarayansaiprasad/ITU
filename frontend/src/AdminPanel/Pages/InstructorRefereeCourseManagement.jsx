import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Award, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Eye, 
  RefreshCcw, 
  CreditCard, 
  User, 
  Calendar, 
  FileSpreadsheet, 
  DollarSign, 
  Clock, 
  X 
} from 'lucide-react';
import { getAuthHeader } from '../../utils/auth';

export default function InstructorRefereeCourseManagement() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [metrics, setMetrics] = useState({ totalVerifiedCount: 0, totalRevenue: 0 });

  // Modal details
  const [activeModalReg, setActiveModalReg] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://itu-f4bn.onrender.com');

  useEffect(() => {
    fetchRegistrations();
  }, [courseFilter, paymentStatusFilter]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const params = {};
      if (courseFilter) params.courseOption = courseFilter;
      if (paymentStatusFilter) params.paymentStatus = paymentStatusFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await axios.get(
        `${API_BASE_URL}/api/instructor-referee-course/admin/registrations`,
        {
          params,
          headers: getAuthHeader()
        }
      );

      if (response.data.success) {
        setRegistrations(response.data.data || []);
        if (response.data.summary) {
          setMetrics(response.data.summary);
        }
      }
    } catch (error) {
      console.error('Error fetching course registrations:', error);
      toast.error('Failed to load course registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRegistrations();
  };

  const handleUpdateStatus = async (id, newPaymentStatus) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/instructor-referee-course/admin/registrations/${id}/status`,
        { paymentStatus: newPaymentStatus },
        { headers: getAuthHeader() }
      );

      if (response.data.success) {
        toast.success(`Payment status updated to ${newPaymentStatus.toUpperCase()}`);
        fetchRegistrations();
        if (activeModalReg && activeModalReg._id === id) {
          setActiveModalReg(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/instructor-referee-course/admin/download`,
        {
          params: { courseOption: courseFilter, paymentStatus: paymentStatusFilter },
          responseType: 'blob',
          headers: getAuthHeader()
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ITU_Instructor_Referee_Registrations_${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Excel downloaded successfully');
    } catch (error) {
      console.error('Error downloading excel:', error);
      toast.error('Failed to download Excel file');
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === registrations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(registrations.map(r => r._id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} registration(s)?`)) return;

    try {
      setDeleting(true);
      const response = await axios.delete(
        `${API_BASE_URL}/api/instructor-referee-course/admin/registrations`,
        {
          data: { ids: selectedIds },
          headers: getAuthHeader()
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setSelectedIds([]);
        fetchRegistrations();
      }
    } catch (error) {
      console.error('Error deleting registrations:', error);
      toast.error('Failed to delete registrations');
    } finally {
      setDeleting(false);
    }
  };

  const getMediaUrl = (urlPath) => {
    if (!urlPath) return null;
    if (urlPath.startsWith('http')) return urlPath;
    const cleanPath = urlPath.replace(/\\/g, '/');
    return `${API_BASE_URL}/${cleanPath}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Award className="text-blue-600" size={28} />
            National Instructor & Referee Course 2026 Registrations
          </h2>
          <p className="text-slate-500 text-sm mt-1">Manage event registrations, verify payments, and export course records.</p>
        </div>

        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm"
            >
              <Trash2 size={16} />
              <span>Delete ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={handleDownloadExcel}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <FileSpreadsheet size={18} />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <User size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Registrations</div>
            <div className="text-2xl font-extrabold text-slate-900">{registrations.length}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Verified Revenue</div>
            <div className="text-2xl font-extrabold text-emerald-700">₹{metrics.totalRevenue.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Pending Verifications</div>
            <div className="text-2xl font-extrabold text-amber-600">
              {registrations.filter(r => r.paymentStatus === 'pending').length}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Award size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Verified Participants</div>
            <div className="text-2xl font-extrabold text-purple-700">{metrics.totalVerifiedCount}</div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, reg no, mobile, email, UTR reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none"
          >
            <option value="">All Course Types</option>
            <option value="instructor">Instructor Only (₹3,000)</option>
            <option value="referee">Referee Only (₹3,000)</option>
            <option value="both">Both Courses (₹5,000)</option>
          </select>

          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none"
          >
            <option value="">All Payment Statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={fetchRegistrations}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Refresh List"
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto"></div>
            <p className="mt-3 text-slate-500 text-sm">Loading course registrations...</p>
          </div>
        ) : registrations.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Award size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-slate-600 font-semibold">No course registrations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === registrations.length && registrations.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="p-4">Reg No & Applicant</th>
                  <th className="p-4">Dan / Degree</th>
                  <th className="p-4">Course & Fee</th>
                  <th className="p-4">Payment UTR</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(reg._id)}
                        onChange={() => toggleSelect(reg._id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{reg.fullName}</div>
                      <div className="text-xs font-mono font-semibold text-blue-600">{reg.registrationNo}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{reg.mobileNumber} | {reg.state}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{reg.presentDan}</div>
                      <div className="text-xs text-slate-500">
                        {reg.isAwaitingDanCertificate ? (
                          <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium">Awaiting Cert</span>
                        ) : (
                          <span>Cert: {reg.danCertificateNo || 'N/A'}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{reg.selectedCourses?.join(', ')}</div>
                      <div className="text-xs font-bold text-emerald-700">₹{reg.feeAmount?.toLocaleString('en-IN')}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-xs font-bold text-slate-700">{reg.transactionId}</div>
                      <div className="text-xs text-slate-400">{new Date(reg.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                        reg.paymentStatus === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : reg.paymentStatus === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {reg.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setActiveModalReg(reg)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                        title="View Full Details"
                      >
                        <Eye size={18} />
                      </button>

                      {reg.paymentStatus !== 'verified' && (
                        <button
                          onClick={() => handleUpdateStatus(reg._id, 'verified')}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md"
                          title="Verify Payment"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}

                      {reg.paymentStatus !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateStatus(reg._id, 'rejected')}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                          title="Reject Payment"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {activeModalReg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Registration Details</h3>
                <span className="text-xs font-mono font-bold text-blue-600">{activeModalReg.registrationNo}</span>
              </div>
              <button
                onClick={() => setActiveModalReg(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <h4 className="font-bold text-blue-700 border-b pb-1">Personal Info</h4>
                <p><strong>Name:</strong> {activeModalReg.fullName}</p>
                <p><strong>Parent Name:</strong> {activeModalReg.fatherMotherName}</p>
                <p><strong>DOB:</strong> {new Date(activeModalReg.dob).toLocaleDateString()}</p>
                <p><strong>Gender / Nationality:</strong> {activeModalReg.gender} / {activeModalReg.nationality}</p>
                <p><strong>Mobile:</strong> {activeModalReg.mobileNumber}</p>
                <p><strong>Email:</strong> {activeModalReg.email}</p>
                <p><strong>Address:</strong> {activeModalReg.address}, {activeModalReg.state} - {activeModalReg.pinCode}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-blue-700 border-b pb-1">Taekwondo Info</h4>
                <p><strong>Present Dan:</strong> {activeModalReg.presentDan}</p>
                <p><strong>Dan Cert No:</strong> {activeModalReg.isAwaitingDanCertificate ? 'Awaiting Certificate' : activeModalReg.danCertificateNo}</p>
                <p><strong>Academy:</strong> {activeModalReg.academyName}</p>
                <p><strong>Experience:</strong> {activeModalReg.yearsExperience} Yrs</p>
                <p><strong>Designation:</strong> {activeModalReg.currentDesignation}</p>
                <p><strong>Selected Courses:</strong> {activeModalReg.selectedCourses?.join(', ')}</p>
                <p><strong>Fee Amount:</strong> ₹{activeModalReg.feeAmount?.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Proof images if available */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
              {activeModalReg.photo && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Passport Photo</span>
                  <img src={getMediaUrl(activeModalReg.photo)} alt="Applicant Photo" className="h-40 rounded-lg object-cover border border-slate-200" />
                </div>
              )}
              {activeModalReg.paymentProof && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Payment Proof Screenshot</span>
                  <img src={getMediaUrl(activeModalReg.paymentProof)} alt="Payment Receipt" className="h-40 rounded-lg object-cover border border-slate-200" />
                </div>
              )}
            </div>

            {/* Action footer */}
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-xs text-slate-500">Transaction ID: <strong className="font-mono text-slate-800">{activeModalReg.transactionId}</strong></span>
              
              <div className="flex gap-2">
                {activeModalReg.paymentStatus !== 'verified' && (
                  <button
                    onClick={() => handleUpdateStatus(activeModalReg._id, 'verified')}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg text-xs"
                  >
                    Verify Payment
                  </button>
                )}
                {activeModalReg.paymentStatus !== 'rejected' && (
                  <button
                    onClick={() => handleUpdateStatus(activeModalReg._id, 'rejected')}
                    className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-xs"
                  >
                    Reject Payment
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

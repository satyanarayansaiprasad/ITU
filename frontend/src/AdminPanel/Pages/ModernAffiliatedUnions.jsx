import React, { useState, useEffect } from "react";
import api from "../../utils/axiosConfig";
import { 
  Search, CheckCircle, AlertCircle, Loader, Mail, Phone, 
  MapPin, Calendar, Download, RefreshCw, FileSpreadsheet, 
  User, Award, ChevronRight, Copy, Plus, Edit, Trash2, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_ENDPOINTS } from "../../config/api";

const ModernAffiliatedUnions = () => {
  const [unions, setUnions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [notification, setNotification] = useState(null);
  const [copyingId, setCopyingId] = useState(null);

  // CRUD States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUnion, setSelectedUnion] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    district: "",
    presidentName: "",
    secretaryName: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    fetchUnions();
  }, []);

  const fetchUnions = async () => {
    setLoading(true);
    try {
      // Fetch directly from the dedicated approved-unions endpoint
      const response = await api.get(API_ENDPOINTS.GET_APPROVED_UNIONS);
      if (response.data && response.data.success) {
        setUnions(response.data.data || []);
      } else {
        setUnions([]);
      }
    } catch (error) {
      console.error("Error fetching unions:", error);
      showNotification("Failed to fetch affiliated unions from database", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Union/Organization Name is required";
    if (!formData.state.trim()) return "State is required";
    if (!formData.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Invalid email address";
    if (!formData.phone.trim()) return "Phone number is required";
    return null;
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: "",
      state: "",
      district: "",
      presidentName: "",
      secretaryName: "",
      email: "",
      phone: "",
      address: ""
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (union) => {
    setSelectedUnion(union);
    setFormData({
      name: union.name || "",
      state: union.state || "",
      district: union.district || "",
      presidentName: union.presidentName || "",
      secretaryName: union.secretaryName || "",
      email: union.email || "",
      phone: union.phone || "",
      address: union.address || ""
    });
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (union) => {
    setSelectedUnion(union);
    setIsDeleteModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      showNotification(errorMsg, "error");
      return;
    }

    setSubmitLoading(true);
    try {
      const response = await api.post(API_ENDPOINTS.CREATE_APPROVED_UNION, formData);
      if (response.data.success) {
        showNotification("Union manually created and approved successfully!");
        setIsAddModalOpen(false);
        fetchUnions();
      }
    } catch (error) {
      console.error("Error creating union:", error);
      showNotification(error.response?.data?.error || "Failed to create union", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      showNotification(errorMsg, "error");
      return;
    }

    setSubmitLoading(true);
    try {
      const response = await api.put(
        API_ENDPOINTS.UPDATE_APPROVED_UNION(selectedUnion._id),
        formData
      );
      if (response.data.success) {
        showNotification("Union details updated successfully!");
        setIsEditModalOpen(false);
        fetchUnions();
      }
    } catch (error) {
      console.error("Error updating union:", error);
      showNotification(error.response?.data?.error || "Failed to update union", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setSubmitLoading(true);
    try {
      const response = await api.delete(
        API_ENDPOINTS.DELETE_APPROVED_UNION(selectedUnion._id)
      );
      if (response.data.success) {
        showNotification("Union deleted successfully!");
        setIsDeleteModalOpen(false);
        fetchUnions();
      }
    } catch (error) {
      console.error("Error deleting union:", error);
      showNotification(error.response?.data?.error || "Failed to delete union", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleExportExcel = () => {
    showNotification("Generating Excel sheet...");
    window.location.href = API_ENDPOINTS.DOWNLOAD_APPROVED_UNIONS;
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopyingId(id);
    showNotification("Copied to clipboard!");
    setTimeout(() => setCopyingId(null), 1500);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const cleanString = (val) => {
    if (!val || val === "undefined" || val.toString().trim() === "") {
      return "N/A";
    }
    return val.toString().trim();
  };

  // Get unique states for filter list
  const uniqueStates = ["all", ...new Set(unions.map((u) => u.state).filter(Boolean))];

  // Filter unions based on search and state filter
  const filteredUnions = unions
    .map((u) => ({
      ...u,
      certId: u._id ? `ITU-${u._id.toString().substring(0, 8).toUpperCase()}` : ""
    }))
    .filter((u) => {
      const searchLower = searchTerm.toLowerCase();
      const matchSearch =
        u.name?.toLowerCase().includes(searchLower) ||
        u.certId?.toLowerCase().includes(searchLower) ||
        u.state?.toLowerCase().includes(searchLower) ||
        u.district?.toLowerCase().includes(searchLower) ||
        u.presidentName?.toLowerCase().includes(searchLower) ||
        u.secretaryName?.toLowerCase().includes(searchLower) ||
        u.email?.toLowerCase().includes(searchLower) ||
        u.phone?.toString().includes(searchLower);

      const matchState = stateFilter === "all" || u.state === stateFilter;

      return matchSearch && matchState;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Notifications */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
                notification.type === "error" ? "bg-red-500 text-white" : "bg-[#0E2A4E] text-white"
              }`}
            >
              {notification.type === "error" ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#0E2A4E] mb-2 flex items-center gap-3">
                <Award className="text-[#0E2A4E]" />
                Affiliated State Unions
              </h1>
              <p className="text-gray-600">
                View, manually add, edit, and revoke officially affiliated state unions and download reports
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={fetchUnions}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-gray-700 shadow-sm"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
              
              <button 
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <Plus size={16} />
                Add Union
              </button>

              <button 
                onClick={handleExportExcel}
                disabled={loading || unions.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-[#0E2A4E] text-white rounded-lg hover:bg-[#193C69] transition-colors shadow-sm disabled:opacity-50"
              >
                <Download size={16} />
                Export to Excel
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#0E2A4E]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold">Approved State Unions</p>
                <p className="text-3xl font-bold text-[#0E2A4E]">{unions.length}</p>
              </div>
              <FileSpreadsheet className="text-[#0E2A4E] opacity-80" size={36} />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold">Active Certificates</p>
                <p className="text-3xl font-bold text-green-600">{unions.length}</p>
              </div>
              <Award className="text-green-500 opacity-80" size={36} />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold">Filtered Unions</p>
                <p className="text-3xl font-bold text-blue-600">{filteredUnions.length}</p>
              </div>
              <User className="text-blue-500 opacity-80" size={36} />
            </div>
          </motion.div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="bg-white rounded-2xl shadow-md p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by union name, state, district, email, certificate id..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0E2A4E] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* State Filter */}
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0E2A4E] focus:border-transparent bg-white outline-none transition-all capitalize text-gray-700 min-w-[200px]"
            >
              {uniqueStates.map((state) => (
                <option key={state} value={state}>
                  {state === "all" ? "All States" : state}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Table List */}
        <motion.div
          className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader size={32} className="animate-spin text-[#0E2A4E]" />
              <span className="ml-3 text-gray-600 font-medium">Loading affiliated unions...</span>
            </div>
          ) : filteredUnions.length === 0 ? (
            <div className="text-center py-20">
              <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileSpreadsheet size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No affiliated unions found</h3>
              <p className="text-gray-500">
                {searchTerm || stateFilter !== "all" ? "Try adjusting your search criteria or filters" : "There are currently no approved state unions"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-[#0E2A4E] to-[#1A4A7A] text-white">
                    <th className="py-4 px-4 text-center font-bold text-sm rounded-tl-2xl">S.No</th>
                    <th className="py-4 px-4 font-bold text-sm">Certificate ID</th>
                    <th className="py-4 px-6 font-bold text-sm">Union / Organization Name</th>
                    <th className="py-4 px-4 font-bold text-sm">State</th>
                    <th className="py-4 px-4 font-bold text-sm">District</th>
                    <th className="py-4 px-4 font-bold text-sm">President Name</th>
                    <th className="py-4 px-4 font-bold text-sm">Secretary Name</th>
                    <th className="py-4 px-4 font-bold text-sm">Contact Info</th>
                    <th className="py-4 px-4 font-bold text-sm text-center">Approval Date</th>
                    <th className="py-4 px-4 font-bold text-sm rounded-tr-2xl text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUnions.map((union, idx) => (
                    <motion.tr
                      key={union._id}
                      variants={itemVariants}
                      className={`hover:bg-[#F9FBFD] transition-colors ${
                        idx % 2 === 0 ? "bg-[#FFF9FBFD]/50" : "bg-white"
                      }`}
                    >
                      <td className="py-4 px-4 text-center font-medium text-gray-500 text-sm">
                        {idx + 1}
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold text-gray-800">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-xs">
                            {union.certId}
                          </span>
                          <button
                            onClick={() => copyToClipboard(union.certId, union._id)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="Copy ID"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-[#0E2A4E] uppercase">
                        {union.name}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 font-medium">
                        {union.state}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {cleanString(union.district)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 font-medium uppercase">
                        {cleanString(union.presidentName)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 font-medium uppercase">
                        {cleanString(union.secretaryName)}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <div className="flex flex-col gap-1">
                          <a 
                            href={`mailto:${union.email}`}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                          >
                            <Mail size={12} className="text-gray-400" />
                            {union.email}
                          </a>
                          <span className="flex items-center gap-1 text-xs text-gray-600">
                            <Phone size={12} className="text-gray-400" />
                            {union.phone}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 text-center font-mono">
                        {formatDate(union.updatedAt)}
                      </td>
                      <td className="py-4 px-4 text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(union)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Union"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(union)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Revoke / Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* ADD UNION MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
            >
              <div className="bg-[#0E2A4E] text-white px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Plus size={20} />
                  Add Affiliated Union Manually
                </h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Union / Organization Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. KARNATAKA TAEKWONDO UNION"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0E2A4E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Karnataka"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0E2A4E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">District</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      placeholder="e.g. Bengaluru"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0E2A4E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">President Name</label>
                    <input
                      type="text"
                      name="presidentName"
                      value={formData.presidentName}
                      onChange={handleInputChange}
                      placeholder="e.g. MR. JOHN DOE"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0E2A4E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Secretary Name</label>
                    <input
                      type="text"
                      name="secretaryName"
                      value={formData.secretaryName}
                      onChange={handleInputChange}
                      placeholder="e.g. MR. SHANKAR M"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0E2A4E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. contact@karnatakatu.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0E2A4E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number *</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. +91 9876543210"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0E2A4E] outline-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Office Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Enter the full office address..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0E2A4E] outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {submitLoading ? (
                      <Loader size={16} className="animate-spin" />
                    ) : (
                      "Save and Approve"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT UNION MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
            >
              <div className="bg-[#0E2A4E] text-white px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Edit size={20} />
                  Edit Affiliated Union
                </h3>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2 font-mono text-xs text-gray-500 bg-gray-50 p-2.5 rounded border border-gray-150 flex items-center justify-between">
                    <span>Certificate ID: <strong>{selectedUnion?.certId}</strong></span>
                    <span>Database ID: <strong>{selectedUnion?._id}</strong></span>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Union / Organization Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. KARNATAKA TAEKWONDO UNION"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0E2A4E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Karnataka"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0E2A4E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">District</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      placeholder="e.g. Bengaluru"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0E2A4E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">President Name</label>
                    <input
                      type="text"
                      name="presidentName"
                      value={formData.presidentName}
                      onChange={handleInputChange}
                      placeholder="e.g. MR. JOHN DOE"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0E2A4E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Secretary Name</label>
                    <input
                      type="text"
                      name="secretaryName"
                      value={formData.secretaryName}
                      onChange={handleInputChange}
                      placeholder="e.g. MR. SHANKAR M"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0E2A4E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. contact@karnatakatu.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0E2A4E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number *</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. +91 9876543210"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0E2A4E] outline-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Office Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Enter the full office address..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0E2A4E] outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="px-5 py-2 bg-[#0E2A4E] text-white rounded-lg hover:bg-[#193C69] transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {submitLoading ? (
                      <Loader size={16} className="animate-spin" />
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-red-600 text-white px-6 py-4 flex items-center gap-2">
                <Trash2 size={20} />
                <h3 className="text-lg font-bold">Delete Affiliated Union?</h3>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-gray-600">
                  Are you sure you want to delete/revoke the affiliation for:
                  <strong className="block text-gray-800 text-base mt-2 uppercase">
                    {selectedUnion?.name}
                  </strong>
                  <span className="block font-mono text-xs text-gray-500 mt-1">
                    (ID: {selectedUnion?.certId})
                  </span>
                </p>
                
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>
                    Warning: This action will completely remove the state union record and its login credentials from the database. This action is permanent and cannot be undone.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteSubmit}
                    disabled={submitLoading}
                    className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {submitLoading ? (
                      <Loader size={16} className="animate-spin" />
                    ) : (
                      "Confirm Delete"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernAffiliatedUnions;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Search, CheckCircle, AlertCircle, Loader, Mail, Phone, 
  MapPin, Calendar, Download, RefreshCw, FileSpreadsheet, 
  User, Award, ChevronRight, Copy
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

  useEffect(() => {
    fetchUnions();
  }, []);

  const fetchUnions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.GET_FORM);
      // Filter for approved unions only
      const approvedUnions = response.data.filter(
        (form) => form.status === "approved"
      );
      setUnions(approvedUnions);
    } catch (error) {
      console.error("Error fetching unions:", error);
      showNotification("Failed to fetch affiliated unions", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
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
    .map((u, idx) => ({
      ...u,
      certId: `ITU-${u._id.substring(0, 8).toUpperCase()}`
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
    // Sort alphabetically by Name
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
                View officially affiliated & approved state unions and download reports
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
                    <th className="py-4 px-4 font-bold text-sm rounded-tr-2xl text-center">Approval Date</th>
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
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default ModernAffiliatedUnions;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  CheckSquare,
  Square,
  AlertCircle,
  Building2,
  Key
} from "lucide-react";
import { toast } from "react-toastify";

const PlayerManagement = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [approving, setApproving] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(null);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected

  useEffect(() => {
    fetchPlayers();
  }, [filter]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const params = filter !== "all" ? { status: filter } : {};
      const response = await axios.get(API_ENDPOINTS.GET_PLAYERS, { params });
      if (response.data.success) {
        setPlayers(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
      toast.error("Failed to load players");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    const pendingPlayers = players.filter(p => p.status === 'pending');
    if (selectedPlayers.length === pendingPlayers.length) {
      setSelectedPlayers([]);
    } else {
      setSelectedPlayers(pendingPlayers.map(p => p._id));
    }
  };

  const handleSelectPlayer = (playerId) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    } else {
      setSelectedPlayers([...selectedPlayers, playerId]);
    }
  };

  const handleApproveAll = async () => {
    if (selectedPlayers.length === 0) {
      toast.warning("Please select at least one player to approve");
      return;
    }

    if (!window.confirm(`Are you sure you want to approve ${selectedPlayers.length} player(s)? They will receive welcome emails with their credentials.`)) {
      return;
    }

    try {
      setApproving(true);
      const response = await axios.post(API_ENDPOINTS.APPROVE_PLAYERS, {
        playerIds: selectedPlayers
      });

      if (response.data.success) {
        const approvedCount = response.data.approved || 0;
        const errors = response.data.errors || [];
        const emailFailedCount = errors.length;
        
        if (emailFailedCount > 0) {
          toast.warning(`${approvedCount} player(s) approved. ${emailFailedCount} email(s) failed to send.`, {
            autoClose: 5000
          });
        } else {
          toast.success(`${approvedCount} player(s) approved successfully! Welcome emails sent.`);
        }
        
        // Update local state immediately
        setPlayers(prevPlayers => 
          prevPlayers.map(player => 
            selectedPlayers.includes(player._id)
              ? { ...player, status: 'approved', approvedAt: new Date() }
              : player
          )
        );
        
        setSelectedPlayers([]);
        
        // Also fetch fresh data to ensure consistency
        await fetchPlayers();
      } else {
        toast.error(response.data.error || "Failed to approve players");
      }
    } catch (error) {
      console.error("Error approving players:", error);
      toast.error(error.response?.data?.error || "Failed to approve players");
    } finally {
      setApproving(false);
    }
  };

  const handleApproveSingle = async (playerId) => {
    if (!window.confirm("Are you sure you want to approve this player? They will receive a welcome email with their credentials.")) {
      return;
    }

    try {
      setApproving(true);
      const response = await axios.post(API_ENDPOINTS.APPROVE_PLAYERS, {
        playerIds: [playerId]
      });

      if (response.data.success) {
        toast.success("Player approved successfully! Welcome email sent.");
        setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
        
        // Update local state immediately
        setPlayers(prevPlayers => 
          prevPlayers.map(player => 
            player._id === playerId 
              ? { ...player, status: 'approved', approvedAt: new Date() }
              : player
          )
        );
        
        // Also fetch fresh data to ensure consistency
        await fetchPlayers();
      } else {
        toast.error(response.data.error || "Failed to approve player");
      }
    } catch (error) {
      console.error("Error approving player:", error);
      toast.error(error.response?.data?.error || "Failed to approve player");
    } finally {
      setApproving(false);
    }
  };

  const handleResendEmail = async (playerId) => {
    if (!window.confirm("Are you sure you want to resend the welcome email to this player?")) {
      return;
    }

    try {
      setResendingEmail(playerId);
      const response = await axios.post(API_ENDPOINTS.RESEND_PLAYER_EMAIL(playerId));

      if (response.data.success) {
        toast.success("Welcome email resent successfully!", {
          autoClose: 3000
        });
        
        // Update local state
        setPlayers(prevPlayers => 
          prevPlayers.map(player => 
            player._id === playerId 
              ? { 
                  ...player, 
                  emailSent: response.data.emailSent || true,
                  emailSentAt: response.data.emailSentAt || new Date()
                }
              : player
          )
        );
        
        // Fetch fresh data
        await fetchPlayers();
      } else {
        toast.error(response.data.error || "Failed to resend email");
      }
    } catch (error) {
      console.error("Error resending email:", error);
      toast.error(error.response?.data?.error || "Failed to resend email");
    } finally {
      setResendingEmail(null);
    }
  };

  const handleRejectSingle = async (playerId) => {
    const reason = window.prompt("Please provide a reason for rejection (optional):");
    if (reason === null) return; // User cancelled

    if (!window.confirm("Are you sure you want to reject this player?")) {
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.REJECT_PLAYERS, {
        playerIds: [playerId],
        reason: reason || "Not specified"
      });

      if (response.data.success) {
        toast.success("Player rejected successfully");
        
        // Update local state immediately
        setPlayers(prevPlayers => 
          prevPlayers.map(player => 
            player._id === playerId 
              ? { ...player, status: 'rejected', rejectedAt: new Date() }
              : player
          )
        );
        
        // Also fetch fresh data to ensure consistency
        await fetchPlayers();
      } else {
        toast.error(response.data.error || "Failed to reject player");
      }
    } catch (error) {
      console.error("Error rejecting player:", error);
      toast.error(error.response?.data?.error || "Failed to reject player");
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const pendingCount = players.filter(p => p.status === 'pending').length;
  const approvedCount = players.filter(p => p.status === 'approved').length;
  const rejectedCount = players.filter(p => p.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <User className="text-blue-500" size={32} />
            Player Management
          </h1>
          <p className="text-gray-600">Approve or reject player registrations</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <div className="text-2xl font-bold text-gray-900">{players.length}</div>
            <div className="text-sm text-gray-600">Total Players</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-xl shadow-md border-2 border-yellow-200">
            <div className="text-2xl font-bold text-yellow-700">{pendingCount}</div>
            <div className="text-sm text-yellow-600">Pending</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl shadow-md border-2 border-green-200">
            <div className="text-2xl font-bold text-green-700">{approvedCount}</div>
            <div className="text-sm text-green-600">Approved</div>
          </div>
          <div className="bg-red-50 p-4 rounded-xl shadow-md border-2 border-red-200">
            <div className="text-2xl font-bold text-red-700">{rejectedCount}</div>
            <div className="text-sm text-red-600">Rejected</div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Filter:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Players</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {pendingCount > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  {selectedPlayers.length === pendingCount ? (
                    <CheckSquare size={16} />
                  ) : (
                    <Square size={16} />
                  )}
                  Select All Pending ({pendingCount})
                </button>
                <button
                  onClick={handleApproveAll}
                  disabled={selectedPlayers.length === 0 || approving}
                  className={`px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                >
                  {approving ? (
                    <>
                      <Loader className="animate-spin" size={16} />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Approve Selected ({selectedPlayers.length})
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Players List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={32} className="animate-spin text-blue-500" />
            <span className="ml-3 text-gray-600">Loading players...</span>
          </div>
        ) : players.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No players found</h3>
            <p className="text-gray-500">No players match the current filter</p>
          </div>
        ) : (
          <div className="space-y-4">
            {players.map((player) => (
              <motion.div
                key={player._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox for pending players */}
                  {player.status === "pending" && (
                    <input
                      type="checkbox"
                      checked={selectedPlayers.includes(player._id)}
                      onChange={() => handleSelectPlayer(player._id)}
                      className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  )}

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          {player.name}
                          {player.playerId && (
                            <span className="text-sm font-normal text-gray-500">
                              (ID: {player.playerId})
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              player.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : player.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {player.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      {player.status === "pending" && (
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleApproveSingle(player._id)}
                            disabled={approving}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {approving ? (
                              <Loader className="animate-spin" size={16} />
                            ) : (
                              <CheckCircle size={16} />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectSingle(player._id)}
                            disabled={approving}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <XCircle size={16} />
                            Reject
                          </button>
                        </div>
                      )}
                      {player.status === "approved" && (
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleResendEmail(player._id)}
                            disabled={resendingEmail === player._id}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Resend welcome email with login credentials"
                          >
                            {resendingEmail === player._id ? (
                              <Loader className="animate-spin" size={16} />
                            ) : (
                              <Mail size={16} />
                            )}
                            Resend Email
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail size={16} className="text-blue-500" />
                        <span className="text-sm">{player.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone size={16} className="text-green-500" />
                        <span className="text-sm">{player.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin size={16} className="text-orange-500" />
                        <span className="text-sm">{player.district}, {player.state}</span>
                      </div>
                      {(player.unionName || (player.union && typeof player.union === 'object' && player.union.name)) && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Building2 size={16} className="text-purple-500" />
                          <span className="text-sm">Union: {player.unionName || (player.union && player.union.name) || 'N/A'}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={16} className="text-purple-500" />
                        <span className="text-sm">DOB: {formatDate(player.dob)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Award size={16} className="text-yellow-500" />
                        <span className="text-sm">Belt: {player.beltLevel}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock size={16} className="text-indigo-500" />
                        <span className="text-sm">{player.yearsOfExperience} years experience</span>
                      </div>
                      {player.status === 'approved' && player.password && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Key size={16} className="text-red-500" />
                          <span className="text-sm font-semibold">Password:</span>
                          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{player.password}</span>
                        </div>
                      )}
                    </div>

                    {player.address && (
                      <div className="mt-3 text-sm text-gray-600">
                        <strong>Address:</strong> {player.address}
                      </div>
                    )}

                    {player.approvedAt && (
                      <div className="mt-2 text-xs text-gray-500">
                        Approved on: {formatDate(player.approvedAt)}
                      </div>
                    )}

                    {player.status === 'approved' && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-700">Email Status:</span>
                          {player.emailSent ? (
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                ✅ Email Sent
                              </span>
                              {player.emailSentAt && (
                                <span className="text-xs text-gray-500">
                                  on {new Date(player.emailSentAt).toLocaleString()}
                                </span>
                              )}
                            </div>
                          ) : player.emailError ? (
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                ❌ Email Failed
                              </span>
                              <span className="text-xs text-red-600" title={player.emailError}>
                                {player.emailError.length > 40 ? player.emailError.substring(0, 40) + '...' : player.emailError}
                              </span>
                            </div>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                              ⏳ Not Sent Yet
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerManagement;


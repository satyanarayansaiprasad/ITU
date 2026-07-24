const Player = require('../models/Players');
const { BELT_RANKS, getRankIndex } = require('../config/beltRanks');

/**
 * Verify ITU Player Certificate
 * POST /api/verify-certificate
 * Body: { ituId, beltRank }
 */
const verifyCertificate = async (req, res) => {
  try {
    const { ituId, beltRank } = req.body;

    if (!ituId || typeof ituId !== 'string' || !ituId.trim()) {
      return res.status(400).json({
        success: false,
        status: 'ERROR',
        message: 'Please provide a valid ITU ID.'
      });
    }

    if (!beltRank || typeof beltRank !== 'string' || !beltRank.trim()) {
      return res.status(400).json({
        success: false,
        status: 'ERROR',
        message: 'Please select a belt rank.'
      });
    }

    const trimmedItuId = ituId.trim();
    const trimmedBeltRank = beltRank.trim();
    const submittedRankIndex = getRankIndex(trimmedBeltRank);

    // Validate that the submitted rank exists in BELT_RANKS
    if (submittedRankIndex === -1) {
      return res.status(400).json({
        success: false,
        status: 'ERROR',
        message: 'The selected belt rank is invalid.'
      });
    }

    // Lookup player case-insensitively by playerId
    const escapedItuId = trimmedItuId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const player = await Player.findOne({
      playerId: { $regex: new RegExp(`^${escapedItuId}$`, 'i') }
    });

    if (!player) {
      return res.status(200).json({
        success: false,
        status: 'INVALID',
        message: "❌ We couldn't verify this certificate. The ITU ID and belt rank don't match our records."
      });
    }

    const currentRankIndex = player.rankIndex !== undefined && player.rankIndex !== null && player.rankIndex >= 0
      ? player.rankIndex
      : getRankIndex(player.beltLevel);

    // Exact Rank Match
    if (submittedRankIndex === currentRankIndex) {
      return res.status(200).json({
        success: true,
        status: 'VALID',
        message: `✅ Congratulations! ${player.name} is a verified ITU player, currently ranked ${player.beltLevel}.`,
        player: {
          name: player.name,
          currentRank: player.beltLevel,
          ituId: player.playerId,
          state: player.state,
          district: player.district
        }
      });
    }

    // Player has since been promoted
    if (currentRankIndex > submittedRankIndex) {
      return res.status(200).json({
        success: true,
        status: 'PROMOTED',
        message: `✅ This is a valid ITU certificate. ${player.name} was awarded ${trimmedBeltRank} at the time of issue and has since progressed to ${player.beltLevel}. Congratulations!`,
        player: {
          name: player.name,
          submittedRank: trimmedBeltRank,
          currentRank: player.beltLevel,
          ituId: player.playerId,
          state: player.state,
          district: player.district
        }
      });
    }

    // Submitted rank higher than DB rank or mismatch
    return res.status(200).json({
      success: false,
      status: 'INVALID',
      message: "❌ We couldn't verify this certificate. The ITU ID and belt rank don't match our records."
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return res.status(500).json({
      success: false,
      status: 'SERVER_ERROR',
      message: 'An error occurred while verifying the certificate. Please try again later.'
    });
  }
};

module.exports = {
  verifyCertificate
};

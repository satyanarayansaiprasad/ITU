const mongoose = require('mongoose');
const AccelerationForm = require('../models/AccelerationForm');

/**
 * Verify Affiliation Certificate
 * POST /api/verify-affiliation
 * Body: { certificateId }
 */
const verifyAffiliation = async (req, res) => {
  try {
    const { certificateId } = req.body;

    if (!certificateId || typeof certificateId !== 'string' || !certificateId.trim()) {
      return res.status(400).json({
        success: false,
        status: 'ERROR',
        message: 'Please provide a valid Certificate ID.'
      });
    }

    const cleanId = certificateId.trim();
    const escapedId = cleanId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Build query conditions to match against Mongo _id, certificateId, or affiliationId
    const queryConditions = [
      { certificateId: { $regex: new RegExp(`^${escapedId}$`, 'i') } },
      { affiliationId: { $regex: new RegExp(`^${escapedId}$`, 'i') } }
    ];

    if (mongoose.Types.ObjectId.isValid(cleanId)) {
      queryConditions.push({ _id: cleanId });
    }

    const union = await AccelerationForm.findOne({
      status: 'approved',
      $or: queryConditions
    });

    if (!union) {
      return res.status(200).json({
        success: false,
        status: 'INVALID',
        message: "❌ We couldn't verify this affiliation certificate. The Certificate ID doesn't match our records."
      });
    }

    const orgName = union.name || union.presidentName || union.secretaryName || 'Affiliated Union';

    return res.status(200).json({
      success: true,
      status: 'VALID',
      message: `🎉 Congratulations to ${orgName}! You are an officially affiliated member of the Indian Taekwondo Union. Thank you, you have a genuine certificate!`,
      union: {
        id: union._id,
        certificateId: union.certificateId || union.affiliationId || union._id,
        name: orgName,
        state: union.state,
        district: union.district || 'N/A',
        presidentName: union.presidentName || 'N/A',
        secretaryName: union.secretaryName || 'N/A',
        approvedAt: union.updatedAt || union.createdAt
      }
    });
  } catch (error) {
    console.error('Error verifying affiliation certificate:', error);
    return res.status(500).json({
      success: false,
      status: 'SERVER_ERROR',
      message: 'An error occurred while verifying the affiliation certificate. Please try again later.'
    });
  }
};

module.exports = {
  verifyAffiliation
};

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

    const cleanId = certificateId.trim().toUpperCase();

    // Fetch all approved unions from AccelerationForm
    const approvedUnions = await AccelerationForm.find({ status: 'approved' });

    // Match against ITU-XXXXXXXX format, 8-char hex, _id, or certificateId/affiliationId
    const union = approvedUnions.find((u) => {
      const generatedCertId = u._id ? `ITU-${u._id.toString().substring(0, 8).toUpperCase()}` : '';
      const hexPrefix = u._id ? u._id.toString().substring(0, 8).toUpperCase() : '';
      const fullMongoId = u._id ? u._id.toString().toUpperCase() : '';
      const customCertId = u.certificateId ? u.certificateId.toString().trim().toUpperCase() : '';
      const customAffId = u.affiliationId ? u.affiliationId.toString().trim().toUpperCase() : '';

      return (
        cleanId === generatedCertId ||
        cleanId === hexPrefix ||
        cleanId === fullMongoId ||
        cleanId === customCertId ||
        cleanId === customAffId
      );
    });

    if (!union) {
      return res.status(200).json({
        success: false,
        status: 'INVALID',
        message: "❌ We couldn't verify this affiliation certificate. The Certificate ID doesn't match our records."
      });
    }

    const orgName = union.name || union.presidentName || union.secretaryName || 'Affiliated Union';
    const displayCertId = `ITU-${union._id.toString().substring(0, 8).toUpperCase()}`;

    return res.status(200).json({
      success: true,
      status: 'VALID',
      message: `🎉 Congratulations to ${orgName}! You are an officially affiliated member of the Indian Taekwondo Union. Thank you, you have a genuine certificate!`,
      union: {
        id: union._id,
        certificateId: displayCertId,
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

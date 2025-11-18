const BeltPromotion = require('../models/BeltPromotion');
const Player = require('../models/Players');
const AccelerationForm = require('../models/AccelerationForm');
let ExcelJS;
try {
  ExcelJS = require('exceljs');
} catch (e) {
  console.warn('exceljs not installed, Excel download will not work');
}

// Submit belt promotion test
exports.submitBeltPromotion = async (req, res) => {
  try {
    const { unionId, tests } = req.body;

    if (!unionId || !tests || !Array.isArray(tests) || tests.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Union ID and tests are required'
      });
    }

    // Get union details
    const union = await AccelerationForm.findById(unionId);
    if (!union) {
      return res.status(404).json({
        success: false,
        error: 'Union not found'
      });
    }

    // Validate and enrich player data
    const enrichedTests = await Promise.all(tests.map(async (test) => {
      if (!test.beltLevel || !test.players || !Array.isArray(test.players) || test.players.length === 0) {
        throw new Error('Each test must have a belt level and at least one player');
      }

      const enrichedPlayers = await Promise.all(test.players.map(async (playerId) => {
        const player = await Player.findById(playerId);
        if (!player) {
          throw new Error(`Player with ID ${playerId} not found`);
        }

        // Verify player belongs to this union
        if (player.union.toString() !== unionId.toString()) {
          throw new Error(`Player ${player.name} does not belong to this union`);
        }

        return {
          playerId: player._id,
          playerName: player.name,
          currentBelt: player.beltLevel || 'White',
          email: player.email,
          phone: player.phone,
          dob: player.dob,
          playerIdNumber: player.playerId
        };
      }));

      return {
        beltLevel: test.beltLevel,
        players: enrichedPlayers
      };
    }));

    // Create belt promotion record
    const beltPromotion = new BeltPromotion({
      unionId,
      unionName: union.name || union.secretaryName,
      state: union.state,
      district: union.district || '',
      tests: enrichedTests,
      status: 'pending'
    });

    await beltPromotion.save();

    res.status(201).json({
      success: true,
      message: 'Belt promotion test submitted successfully',
      data: beltPromotion
    });
  } catch (error) {
    console.error('Error submitting belt promotion:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to submit belt promotion test'
    });
  }
};

// Get belt promotions by union
exports.getBeltPromotionsByUnion = async (req, res) => {
  try {
    const { unionId } = req.params;

    const promotions = await BeltPromotion.find({ unionId })
      .sort({ createdAt: -1 })
      .populate('unionId', 'name secretaryName state district');

    res.status(200).json({
      success: true,
      data: promotions
    });
  } catch (error) {
    console.error('Error fetching belt promotions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch belt promotions'
    });
  }
};

// Get belt promotions for a specific player
exports.getBeltPromotionsByPlayer = async (req, res) => {
  try {
    const { playerId } = req.params;

    // Find all belt promotions where this player is included
    const promotions = await BeltPromotion.find({
      'tests.players.playerId': playerId
    })
      .sort({ createdAt: -1 })
      .populate('unionId', 'name secretaryName state district');

    // Extract player-specific test data
    const playerTests = [];
    promotions.forEach((promotion) => {
      promotion.tests.forEach((test) => {
        const playerData = test.players.find(
          (p) => p.playerId.toString() === playerId.toString()
        );
        if (playerData) {
          playerTests.push({
            _id: promotion._id,
            submittedAt: promotion.submittedAt,
            status: promotion.status,
            rejectionReason: promotion.rejectionReason,
            unionName: promotion.unionName,
            currentBelt: playerData.currentBelt,
            applyingBelt: test.beltLevel,
            playerName: playerData.playerName
          });
        }
      });
    });

    res.status(200).json({
      success: true,
      data: playerTests
    });
  } catch (error) {
    console.error('Error fetching player belt promotions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch belt promotion tests'
    });
  }
};

// Get belt promotions with filters (for admin)
exports.getBeltPromotions = async (req, res) => {
  try {
    const { state, district, unionId } = req.query;

    const filter = {};
    if (state) filter.state = state;
    if (district) filter.district = district;
    if (unionId) filter.unionId = unionId;

    const promotions = await BeltPromotion.find(filter)
      .sort({ createdAt: -1 })
      .populate('unionId', 'name secretaryName state district email')
      .populate('reviewedBy', 'email');

    res.status(200).json({
      success: true,
      data: promotions
    });
  } catch (error) {
    console.error('Error fetching belt promotions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch belt promotions'
    });
  }
};

// Download Excel for belt promotion
exports.downloadBeltPromotionExcel = async (req, res) => {
  try {
    if (!ExcelJS) {
      return res.status(500).json({
        success: false,
        error: 'Excel generation not available. Please install exceljs package.'
      });
    }

    const { id } = req.params;

    const promotion = await BeltPromotion.findById(id)
      .populate('unionId', 'name state district');

    if (!promotion) {
      return res.status(404).json({
        success: false,
        error: 'Belt promotion test not found'
      });
    }

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Belt Promotion Test');

    // Set headers
    worksheet.columns = [
      { header: 'S.No', key: 'sno', width: 10 },
      { header: 'Player Name', key: 'playerName', width: 25 },
      { header: 'Player ID', key: 'playerId', width: 20 },
      { header: 'Current Belt Level', key: 'currentBelt', width: 20 },
      { header: 'Applying For Belt', key: 'applyingBelt', width: 20 },
      { header: 'Date of Birth', key: 'dob', width: 15 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Union Name', key: 'unionName', width: 30 },
      { header: 'State', key: 'state', width: 15 },
      { header: 'District', key: 'district', width: 15 }
    ];

    // Style headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Add data
    let sno = 1;
    promotion.tests.forEach((test) => {
      test.players.forEach((player) => {
        worksheet.addRow({
          sno: sno++,
          playerName: player.playerName,
          playerId: player.playerIdNumber || 'N/A',
          currentBelt: player.currentBelt,
          applyingBelt: test.beltLevel,
          dob: player.dob ? new Date(player.dob).toLocaleDateString() : 'N/A',
          email: player.email || 'N/A',
          phone: player.phone || 'N/A',
          unionName: promotion.unionName,
          state: promotion.state,
          district: promotion.district
        });
      });
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=belt-promotion-${promotion._id}.xlsx`);

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error generating Excel:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate Excel file'
    });
  }
};

// Approve belt promotion
exports.approveBeltPromotion = async (req, res) => {
  try {
    const { id } = req.params;

    const promotion = await BeltPromotion.findById(id);
    if (!promotion) {
      return res.status(404).json({
        success: false,
        error: 'Belt promotion test not found'
      });
    }

    if (promotion.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'This test has already been reviewed'
      });
    }

    // Update player belt levels
    for (const test of promotion.tests) {
      for (const playerData of test.players) {
        await Player.findByIdAndUpdate(playerData.playerId, {
          beltLevel: test.beltLevel
        });
      }
    }

    // Update promotion status
    promotion.status = 'approved';
    promotion.reviewedAt = new Date();
    promotion.reviewedBy = req.user?.userId || null;
    await promotion.save();

    res.status(200).json({
      success: true,
      message: 'Belt promotion test approved and player belt levels updated',
      data: promotion
    });
  } catch (error) {
    console.error('Error approving belt promotion:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve belt promotion'
    });
  }
};

// Reject belt promotion
exports.rejectBeltPromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const promotion = await BeltPromotion.findById(id);
    if (!promotion) {
      return res.status(404).json({
        success: false,
        error: 'Belt promotion test not found'
      });
    }

    if (promotion.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'This test has already been reviewed'
      });
    }

    promotion.status = 'rejected';
    promotion.reviewedAt = new Date();
    promotion.reviewedBy = req.user?.userId || null;
    promotion.rejectionReason = reason || 'No reason provided';
    await promotion.save();

    res.status(200).json({
      success: true,
      message: 'Belt promotion test rejected',
      data: promotion
    });
  } catch (error) {
    console.error('Error rejecting belt promotion:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject belt promotion'
    });
  }
};


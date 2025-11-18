const Competition = require('../models/Competition');
const Player = require('../models/Players');
const AccelerationForm = require('../models/AccelerationForm');
const News = require('../models/News');
let ExcelJS;
try {
  ExcelJS = require('exceljs');
} catch (e) {
  console.warn('exceljs not installed, Excel download will not work');
}

// Submit competition registration
exports.submitCompetition = async (req, res) => {
  try {
    const { unionId, competitionId, playerIds } = req.body;

    console.log('Competition submission request:', { unionId, competitionId, playerIds, body: req.body });

    if (!unionId) {
      return res.status(400).json({
        success: false,
        error: 'Union ID is required'
      });
    }

    if (!competitionId) {
      return res.status(400).json({
        success: false,
        error: 'Competition ID is required'
      });
    }

    if (!playerIds || !Array.isArray(playerIds)) {
      return res.status(400).json({
        success: false,
        error: 'Player IDs must be an array'
      });
    }

    if (playerIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one player must be selected'
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

    // Get competition details
    const News = require('../models/News');
    const competition = await News.findById(competitionId);
    if (!competition) {
      return res.status(404).json({
        success: false,
        error: 'Competition not found'
      });
    }

    // Validate competition category (case-insensitive check)
    const validCategories = ['events', 'training', 'competitions', 'Events', 'Training', 'Competitions'];
    const categoryLower = competition.category?.toLowerCase();
    if (!validCategories.includes(competition.category) && !['events', 'training', 'competitions'].includes(categoryLower)) {
      return res.status(400).json({
        success: false,
        error: 'Selected competition is not available for registration'
      });
    }

    // Validate and enrich player data
    const enrichedPlayers = await Promise.all(playerIds.map(async (playerId) => {
      const player = await Player.findById(playerId);
      if (!player) {
        console.error(`Player with ID ${playerId} not found`);
        throw new Error(`Player with ID ${playerId} not found`);
      }

      // Verify player belongs to this union (check both union field and unionId field)
      const playerUnionId = player.union?.toString() || player.unionId?.toString();
      if (playerUnionId && playerUnionId !== unionId.toString()) {
        console.error(`Player ${player.name} (${playerId}) belongs to union ${playerUnionId}, but registration is for union ${unionId}`);
        throw new Error(`Player ${player.name} does not belong to this union`);
      }

      // Get player's union details (use player's union or the submitting union)
      const unionToUse = player.union || unionId;
      const playerUnion = await AccelerationForm.findById(unionToUse);

      return {
        playerId: player._id,
        playerName: player.name,
        playerIdNumber: player.playerId,
        email: player.email,
        phone: player.phone,
        dob: player.dob,
        beltLevel: player.beltLevel || 'N/A',
        unionName: playerUnion?.name || playerUnion?.secretaryName || player.unionName || union.name || 'N/A',
        unionId: player.union || unionId
      };
    }));

    // Check if registration already exists (only block if pending)
    const existingRegistration = await Competition.findOne({
      unionId,
      competitionId,
      status: 'pending'
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        error: 'You have already submitted a registration for this competition. Please wait for approval or contact admin if you need to update it.',
        existingRegistrationId: existingRegistration._id
      });
    }

    // Create competition registration
    const competitionRegistration = new Competition({
      unionId,
      unionName: union.name || union.secretaryName,
      state: union.state,
      district: union.district || '',
      competitionId,
      competitionTitle: competition.title,
      competitionCategory: competition.category,
      players: enrichedPlayers,
      status: 'pending'
    });

    await competitionRegistration.save();

    res.status(201).json({
      success: true,
      message: 'Competition registration submitted successfully',
      data: competitionRegistration
    });
  } catch (error) {
    console.error('Error submitting competition registration:', error);
    console.error('Error stack:', error.stack);
    
    // Return more specific error messages
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    
    if (error.message.includes('does not belong')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to submit competition registration'
    });
  }
};

// Get competitions by union
exports.getCompetitionsByUnion = async (req, res) => {
  try {
    const { unionId } = req.params;

    if (!unionId) {
      return res.status(400).json({
        success: false,
        error: 'Union ID is required'
      });
    }

    const competitions = await Competition.find({ unionId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'competitionId',
        select: 'title category content image',
        model: 'news'
      })
      .populate({
        path: 'unionId',
        select: 'name secretaryName state district',
        model: 'AccelerationForm'
      })
      .lean(); // Use lean() to avoid issues with populate

    res.status(200).json({
      success: true,
      data: competitions
    });
  } catch (error) {
    console.error('Error fetching competitions:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch competition registrations'
    });
  }
};

// Get available competitions (from News with category events/training/competitions)
exports.getAvailableCompetitions = async (req, res) => {
  try {
    const competitions = await News.find({
      $or: [
        { category: { $in: ['Events', 'Training', 'Competitions'] } },
        { category: { $in: ['events', 'training', 'competitions'] } }
      ],
      published: true
    })
      .sort({ createdAt: -1 })
      .select('title category content image createdAt');

    res.status(200).json({
      success: true,
      data: competitions
    });
  } catch (error) {
    console.error('Error fetching available competitions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available competitions'
    });
  }
};

// Get competition registrations (for admin)
exports.getCompetitionRegistrations = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const registrations = await Competition.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: 'competitionId',
        select: 'title category content image',
        model: 'news'
      })
      .populate({
        path: 'unionId',
        select: 'name secretaryName state district email',
        model: 'AccelerationForm'
      })
      .populate({
        path: 'reviewedBy',
        select: 'email',
        model: 'Admin'
      })
      .lean();

    res.status(200).json({
      success: true,
      data: registrations
    });
  } catch (error) {
    console.error('Error fetching competition registrations:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch competition registrations'
    });
  }
};

// Download Excel for competition registration
exports.downloadCompetitionExcel = async (req, res) => {
  try {
    if (!ExcelJS) {
      return res.status(500).json({
        success: false,
        error: 'Excel generation not available. Please install exceljs package.'
      });
    }

    const { id } = req.params;

    const registration = await Competition.findById(id)
      .populate('competitionId', 'title category')
      .populate('unionId', 'name state district');

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Competition registration not found'
      });
    }

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Competition Registration');

    // Set headers
    worksheet.columns = [
      { header: 'S.No', key: 'sno', width: 10 },
      { header: 'Player Name', key: 'playerName', width: 25 },
      { header: 'Player ID', key: 'playerId', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Date of Birth', key: 'dob', width: 15 },
      { header: 'Belt Level', key: 'beltLevel', width: 15 },
      { header: 'Union Name', key: 'unionName', width: 30 },
      { header: 'Union State', key: 'state', width: 15 },
      { header: 'Union District', key: 'district', width: 15 },
      { header: 'Competition', key: 'competition', width: 30 }
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
    registration.players.forEach((player) => {
      worksheet.addRow({
        sno: sno++,
        playerName: player.playerName,
        playerId: player.playerIdNumber || 'N/A',
        email: player.email || 'N/A',
        phone: player.phone || 'N/A',
        dob: player.dob ? new Date(player.dob).toLocaleDateString() : 'N/A',
        beltLevel: player.beltLevel || 'N/A',
        unionName: player.unionName || registration.unionName,
        state: registration.state,
        district: registration.district,
        competition: registration.competitionTitle
      });
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=competition-${registration._id}.xlsx`);

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

// Approve competition registration
exports.approveCompetition = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await Competition.findById(id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Competition registration not found'
      });
    }

    if (registration.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'This registration has already been reviewed'
      });
    }

    registration.status = 'approved';
    registration.reviewedAt = new Date();
    registration.reviewedBy = req.user?.userId || null;
    await registration.save();

    res.status(200).json({
      success: true,
      message: 'Competition registration approved',
      data: registration
    });
  } catch (error) {
    console.error('Error approving competition:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve competition registration'
    });
  }
};

// Reject competition registration
exports.rejectCompetition = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const registration = await Competition.findById(id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Competition registration not found'
      });
    }

    if (registration.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'This registration has already been reviewed'
      });
    }

    registration.status = 'rejected';
    registration.reviewedAt = new Date();
    registration.reviewedBy = req.user?.userId || null;
    registration.rejectionReason = reason || 'No reason provided';
    await registration.save();

    res.status(200).json({
      success: true,
      message: 'Competition registration rejected',
      data: registration
    });
  } catch (error) {
    console.error('Error rejecting competition:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject competition registration'
    });
  }
};


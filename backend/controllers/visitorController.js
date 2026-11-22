const Visitor = require('../models/Visitor');
const VisitorCounter = require('../models/VisitorCounter');

/**
 * Helper to get the default base count from environment variable, if configured
 */
const getInitialBaseCount = () => {
  const envCount = parseInt(process.env.INITIAL_VISITOR_COUNT, 10);
  return !isNaN(envCount) && envCount >= 0 ? envCount : 0;
};

/**
 * Get current total visitor count without incrementing
 * GET /api/visitors/count
 */
exports.getVisitorCount = async (req, res) => {
  try {
    let counter = await VisitorCounter.findOne({ name: 'total_visitors' }).lean();

    if (!counter) {
      // If counter document does not exist yet, check if there are existing visitor records
      const existingVisitorCount = await Visitor.countDocuments();
      const initialCount = Math.max(existingVisitorCount, getInitialBaseCount());

      counter = await VisitorCounter.findOneAndUpdate(
        { name: 'total_visitors' },
        { $setOnInsert: { count: initialCount } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean();
    }

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.status(200).json({
      success: true,
      count: counter ? counter.count : 0,
    });
  } catch (error) {
    console.error('Error fetching visitor count:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve visitor count',
      error: error.message,
    });
  }
};

/**
 * Record a visit and increment count ONLY if this is a new visitor
 * POST /api/visitors/visit
 * Body: { visitorId: string }
 */
exports.recordVisit = async (req, res) => {
  try {
    let { visitorId } = req.body;

    // Validate and sanitize visitorId
    if (!visitorId || typeof visitorId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Valid visitorId is required',
      });
    }

    visitorId = visitorId.trim().substring(0, 128);
    if (!visitorId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid visitorId format',
      });
    }

    const clientIp = (
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket?.remoteAddress ||
      req.ip ||
      ''
    ).trim();
    const userAgent = (req.headers['user-agent'] || '').substring(0, 500);

    // Check if visitor already exists in database
    const existingVisitor = await Visitor.findOne({ visitorId }).lean();

    if (existingVisitor) {
      // Returning visitor - do NOT increment total count
      // Update lastVisit timestamp and visit count asynchronously
      Visitor.updateOne(
        { _id: existingVisitor._id },
        {
          $set: { lastVisit: new Date() },
          $inc: { visitCount: 1 },
        }
      ).catch((err) => console.error('Error updating visitor record:', err));

      let counter = await VisitorCounter.findOne({ name: 'total_visitors' }).lean();
      return res.status(200).json({
        success: true,
        count: counter ? counter.count : 0,
        isNewVisitor: false,
      });
    }

    // New visitor detected - atomically register visitor and increment counter
    try {
      await Visitor.create({
        visitorId,
        ip: clientIp,
        userAgent,
        firstVisit: new Date(),
        lastVisit: new Date(),
        visitCount: 1,
      });

      // Atomically increment global visitor counter
      const initialBase = getInitialBaseCount();
      const updatedCounter = await VisitorCounter.findOneAndUpdate(
        { name: 'total_visitors' },
        {
          $inc: { count: 1 },
          $setOnInsert: { name: 'total_visitors' },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean();

      return res.status(200).json({
        success: true,
        count: updatedCounter ? updatedCounter.count : initialBase + 1,
        isNewVisitor: true,
      });
    } catch (createErr) {
      // Handle race condition where two requests with same visitorId arrived simultaneously
      if (createErr.code === 11000) {
        let counter = await VisitorCounter.findOne({ name: 'total_visitors' }).lean();
        return res.status(200).json({
          success: true,
          count: counter ? counter.count : 0,
          isNewVisitor: false,
        });
      }
      throw createErr;
    }
  } catch (error) {
    console.error('Error recording visitor visit:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record visit',
      error: error.message,
    });
  }
};

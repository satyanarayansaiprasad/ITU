const Visitor = require('../models/Visitor');
const VisitorCounter = require('../models/VisitorCounter');

const BASE_DEFAULT_COUNT = 125143;

/**
 * Helper to get the base count from environment variable or default 125,143
 */
const getInitialBaseCount = () => {
  const envCount = parseInt(process.env.INITIAL_VISITOR_COUNT, 10);
  return !isNaN(envCount) && envCount >= 0 ? envCount : BASE_DEFAULT_COUNT;
};

/**
 * Helper to ensure the counter is initialized and at least at the base count
 */
const getOrEnsureCounter = async () => {
  const baseCount = getInitialBaseCount();
  let counter = await VisitorCounter.findOne({ name: 'total_visitors' }).lean();

  if (!counter) {
    counter = await VisitorCounter.findOneAndUpdate(
      { name: 'total_visitors' },
      { $setOnInsert: { count: baseCount } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
  } else if (counter.count < baseCount) {
    // If an existing counter has a lower count than base, update to baseCount
    counter =
      (await VisitorCounter.findOneAndUpdate(
        { name: 'total_visitors', count: { $lt: baseCount } },
        { $set: { count: baseCount } },
        { new: true }
      ).lean()) || counter;
  }

  return counter;
};

/**
 * Get current total visitor count without incrementing
 * GET /api/visitors/count
 */
exports.getVisitorCount = async (req, res) => {
  try {
    const counter = await getOrEnsureCounter();

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.status(200).json({
      success: true,
      count: counter ? counter.count : getInitialBaseCount(),
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

      const counter = await getOrEnsureCounter();
      return res.status(200).json({
        success: true,
        count: counter ? counter.count : getInitialBaseCount(),
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

      // Ensure counter document exists and is at least at base
      await getOrEnsureCounter();

      // Atomically increment global visitor counter
      const updatedCounter = await VisitorCounter.findOneAndUpdate(
        { name: 'total_visitors' },
        { $inc: { count: 1 } },
        { new: true }
      ).lean();

      return res.status(200).json({
        success: true,
        count: updatedCounter ? updatedCounter.count : getInitialBaseCount() + 1,
        isNewVisitor: true,
      });
    } catch (createErr) {
      // Handle race condition where two requests with same visitorId arrived simultaneously
      if (createErr.code === 11000) {
        const counter = await getOrEnsureCounter();
        return res.status(200).json({
          success: true,
          count: counter ? counter.count : getInitialBaseCount(),
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

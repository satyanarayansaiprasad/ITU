const assert = require('assert');
const Visitor = require('../models/Visitor');
const VisitorCounter = require('../models/VisitorCounter');
const visitorController = require('../controllers/visitorController');

const BASE_COUNT = 125143;

// Mock in-memory database storage
let mockVisitors = new Map();
let mockCounter = { name: 'total_visitors', count: BASE_COUNT };

// Setup mocks on Mongoose models
Visitor.findOne = function (query) {
  return {
    lean: async () => {
      if (query.visitorId && mockVisitors.has(query.visitorId)) {
        return { ...mockVisitors.get(query.visitorId) };
      }
      return null;
    },
  };
};

Visitor.create = async function (doc) {
  if (mockVisitors.has(doc.visitorId)) {
    const err = new Error('E11000 duplicate key error');
    err.code = 11000;
    throw err;
  }
  const created = { _id: 'mock_id_' + doc.visitorId, ...doc };
  mockVisitors.set(doc.visitorId, created);
  return created;
};

Visitor.updateOne = async function (query, update) {
  if (query._id) {
    for (const [vId, v] of mockVisitors.entries()) {
      if (v._id === query._id) {
        if (update.$inc && update.$inc.visitCount) {
          v.visitCount = (v.visitCount || 1) + update.$inc.visitCount;
        }
        if (update.$set && update.$set.lastVisit) {
          v.lastVisit = update.$set.lastVisit;
        }
      }
    }
  }
  return { modifiedCount: 1 };
};

Visitor.countDocuments = async function () {
  return mockVisitors.size;
};

VisitorCounter.findOne = function (query) {
  return {
    lean: async () => {
      if (query.name === 'total_visitors') {
        return { ...mockCounter };
      }
      return null;
    },
  };
};

VisitorCounter.findOneAndUpdate = function (query, update, options) {
  return {
    lean: async () => {
      if (update.$inc && update.$inc.count) {
        mockCounter.count += update.$inc.count;
      }
      if (update.$setOnInsert) {
        mockCounter.count = update.$setOnInsert.count || BASE_COUNT;
      }
      if (update.$set && update.$set.count) {
        mockCounter.count = update.$set.count;
      }
      return { ...mockCounter };
    },
  };
};

// Helper to create mock Express req/res
const createMockReqRes = (body = {}, headers = {}) => {
  const req = {
    body,
    headers,
    ip: '127.0.0.1',
    socket: { remoteAddress: '127.0.0.1' },
  };

  let statusCode = 200;
  let responseData = null;
  const resHeaders = {};

  const res = {
    setHeader: (k, v) => {
      resHeaders[k] = v;
    },
    status: (code) => {
      statusCode = code;
      return res;
    },
    json: (data) => {
      responseData = data;
      return res;
    },
    _getStatus: () => statusCode,
    _getData: () => responseData,
  };

  return { req, res };
};

async function runTests() {
  console.log('🧪 Starting Visitor Counter Unit & Integration Tests (Starting Base: 1,25,143)...\n');

  // Test 1: Validation - missing visitorId
  {
    console.log('Test 1: Validation - missing visitorId');
    const { req, res } = createMockReqRes({});
    await visitorController.recordVisit(req, res);
    assert.strictEqual(res._getStatus(), 400);
    assert.strictEqual(res._getData().success, false);
    console.log('  ✅ Correctly rejected missing visitorId with HTTP 400');
  }

  // Test 2: Initial visitor count starts from 1,25,143
  {
    console.log('Test 2: Initial count fetch starts from 1,25,143');
    const { req, res } = createMockReqRes();
    await visitorController.getVisitorCount(req, res);
    assert.strictEqual(res._getStatus(), 200);
    assert.strictEqual(res._getData().count, 125143);
    console.log('  ✅ Correctly retrieved initial count = 1,25,143');
  }

  // Test 3: New visitor 1 visits -> increments count to 1,25,144
  {
    console.log('Test 3: First unique visitor records visit');
    const { req, res } = createMockReqRes({ visitorId: 'user-alice-123' }, { 'user-agent': 'Chrome/120' });
    await visitorController.recordVisit(req, res);
    assert.strictEqual(res._getStatus(), 200);
    assert.strictEqual(res._getData().isNewVisitor, true);
    assert.strictEqual(res._getData().count, 125144);
    console.log('  ✅ First visitor recorded: isNewVisitor = true, count = 1,25,144');
  }

  // Test 4: Same visitor 1 refreshes page (page reload) -> count should NOT increment!
  {
    console.log('Test 4: Page refresh by the SAME visitor');
    const { req, res } = createMockReqRes({ visitorId: 'user-alice-123' }, { 'user-agent': 'Chrome/120' });
    await visitorController.recordVisit(req, res);
    assert.strictEqual(res._getStatus(), 200);
    assert.strictEqual(res._getData().isNewVisitor, false, 'isNewVisitor must be false on refresh');
    assert.strictEqual(res._getData().count, 125144, 'Count must NOT increment on page refresh');
    console.log('  ✅ Page refresh handled correctly: isNewVisitor = false, count remains 1,25,144');
  }

  // Test 5: Re-fetch count via GET endpoint -> remains 1,25,144
  {
    console.log('Test 5: Fetch count via GET /api/visitors/count');
    const { req, res } = createMockReqRes();
    await visitorController.getVisitorCount(req, res);
    assert.strictEqual(res._getStatus(), 200);
    assert.strictEqual(res._getData().count, 125144);
    console.log('  ✅ GET count returned 1,25,144 without incrementing');
  }

  // Test 6: Second unique visitor arrives -> count increments to 1,25,145
  {
    console.log('Test 6: Second unique visitor records visit');
    const { req, res } = createMockReqRes({ visitorId: 'user-bob-456' }, { 'user-agent': 'Safari/17' });
    await visitorController.recordVisit(req, res);
    assert.strictEqual(res._getStatus(), 200);
    assert.strictEqual(res._getData().isNewVisitor, true);
    assert.strictEqual(res._getData().count, 125145);
    console.log('  ✅ Second visitor recorded: isNewVisitor = true, count = 1,25,145');
  }

  // Test 7: Bob refreshes multiple times -> count remains 1,25,145
  {
    console.log('Test 7: Bob refreshes 5 times in a row');
    for (let i = 1; i <= 5; i++) {
      const { req, res } = createMockReqRes({ visitorId: 'user-bob-456' });
      await visitorController.recordVisit(req, res);
      assert.strictEqual(res._getData().isNewVisitor, false);
      assert.strictEqual(res._getData().count, 125145);
    }
    console.log('  ✅ 5 rapid refreshes by Bob: count remained stable at 1,25,145');
  }

  // Test 8: Concurrency race condition simulation (duplicate key error)
  {
    console.log('Test 8: Concurrent requests with same visitorId (race condition handling)');
    const originalFindOne = Visitor.findOne;
    Visitor.findOne = () => ({ lean: async () => null }); // pretends not found

    const { req, res } = createMockReqRes({ visitorId: 'user-alice-123' });
    await visitorController.recordVisit(req, res);
    assert.strictEqual(res._getStatus(), 200);
    assert.strictEqual(res._getData().isNewVisitor, false);
    assert.strictEqual(res._getData().count, 125145);
    console.log('  ✅ Concurrency race condition caught: isNewVisitor = false, count maintained');

    Visitor.findOne = originalFindOne;
  }

  console.log('\n🎉 ALL 8 TESTS PASSED WITH 1,25,143 BASE!\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

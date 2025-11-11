const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');

// Get all states and UTs
router.get('/', statesController.getAllStates);

// Get only states (excluding UTs)
router.get('/states-only', statesController.getStatesOnly);

// Get only union territories
router.get('/union-territories', statesController.getUnionTerritories);

// Get specific state/UT by name
router.get('/:stateName', statesController.getStateByName);

// Get districts for a state/UT
router.get('/:stateName/districts', statesController.getDistrictsByState);

// Update state/UT status
router.patch('/:stateName/status', statesController.updateStateStatus);

module.exports = router;


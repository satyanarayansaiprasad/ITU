const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');

// Create a new state/UT (must be before /:stateName routes)
router.post('/', statesController.createState);

// Get all states and UTs
router.get('/', statesController.getAllStates);

// Get only states (excluding UTs)
router.get('/states-only', statesController.getStatesOnly);

// Get only union territories
router.get('/union-territories', statesController.getUnionTerritories);

// Get districts for a state/UT (must be before /:stateName route)
router.get('/:stateName/districts', statesController.getDistrictsByState);

// Update districts for a state/UT (must be before /:stateName route)
router.put('/:stateName/districts', statesController.updateDistricts);

// Update state/UT status
router.patch('/:stateName/status', statesController.updateStateStatus);

// Delete a state/UT
router.delete('/:stateName', statesController.deleteState);

// Get specific state/UT by name (must be last)
router.get('/:stateName', statesController.getStateByName);

module.exports = router;


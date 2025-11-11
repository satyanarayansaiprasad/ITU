const { firestoreService } = require('../services/firebaseService');

/**
 * Get all states and union territories
 */
exports.getAllStates = async (req, res) => {
  try {
    if (!firestoreService.isAvailable()) {
      return res.status(503).json({ 
        error: 'Firebase service not available',
        message: 'Please configure Firebase credentials'
      });
    }

    const states = await firestoreService.getAll('states');
    
    // Sort by name
    states.sort((a, b) => a.name.localeCompare(b.name));
    
    res.json({
      success: true,
      data: states,
      count: states.length
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a specific state/UT by name or ID
 */
exports.getStateByName = async (req, res) => {
  try {
    if (!firestoreService.isAvailable()) {
      return res.status(503).json({ 
        error: 'Firebase service not available'
      });
    }

    const { stateName } = req.params;
    
    // Try to find by document ID (sanitized name)
    const docId = stateName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    let state = await firestoreService.getById('states', docId);
    
    // If not found by ID, try to find by name
    if (!state) {
      const states = await firestoreService.query('states', 'name', '==', stateName);
      state = states[0] || null;
    }
    
    if (!state) {
      return res.status(404).json({ error: 'State/UT not found' });
    }
    
    res.json({
      success: true,
      data: state
    });
  } catch (error) {
    console.error('Error fetching state:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get districts for a specific state/UT
 */
exports.getDistrictsByState = async (req, res) => {
  try {
    if (!firestoreService.isAvailable()) {
      return res.status(503).json({ 
        error: 'Firebase service not available'
      });
    }

    const { stateName } = req.params;
    
    // Get state first
    const docId = stateName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    let state = await firestoreService.getById('states', docId);
    
    if (!state) {
      const states = await firestoreService.query('states', 'name', '==', stateName);
      state = states[0] || null;
    }
    
    if (!state) {
      return res.status(404).json({ error: 'State/UT not found' });
    }
    
    // Return districts from state document
    res.json({
      success: true,
      data: {
        stateName: state.name,
        stateType: state.type,
        active: state.active,
        districts: state.districts || [],
        districtCount: state.districtCount || 0
      }
    });
  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all states (excluding UTs)
 */
exports.getStatesOnly = async (req, res) => {
  try {
    if (!firestoreService.isAvailable()) {
      return res.status(503).json({ 
        error: 'Firebase service not available'
      });
    }

    const allStates = await firestoreService.getAll('states');
    const states = allStates.filter(s => s.type === 'State');
    states.sort((a, b) => a.name.localeCompare(b.name));
    
    res.json({
      success: true,
      data: states,
      count: states.length
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all union territories
 */
exports.getUnionTerritories = async (req, res) => {
  try {
    if (!firestoreService.isAvailable()) {
      return res.status(503).json({ 
        error: 'Firebase service not available'
      });
    }

    const allStates = await firestoreService.getAll('states');
    const uts = allStates.filter(s => s.type === 'Union Territory');
    uts.sort((a, b) => a.name.localeCompare(b.name));
    
    res.json({
      success: true,
      data: uts,
      count: uts.length
    });
  } catch (error) {
    console.error('Error fetching union territories:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update state/UT active status
 */
exports.updateStateStatus = async (req, res) => {
  try {
    if (!firestoreService.isAvailable()) {
      return res.status(503).json({ 
        error: 'Firebase service not available'
      });
    }

    const { stateName } = req.params;
    const { active, secretary, unionName, established } = req.body;
    
    const docId = stateName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const updateData = {
      updatedAt: new Date().toISOString()
    };
    
    if (active !== undefined) updateData.active = active;
    if (secretary) updateData.secretary = secretary;
    if (unionName) updateData.unionName = unionName;
    if (established) updateData.established = established;
    
    const updated = await firestoreService.update('states', docId, updateData);
    
    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Error updating state:', error);
    res.status(500).json({ error: error.message });
  }
};


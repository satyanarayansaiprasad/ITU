const { firestoreService } = require('../services/firebaseService');
const path = require('path');
const fs = require('fs');

// Fallback: Load static data if Firebase is not available
let staticStatesData = null;
const loadStaticData = () => {
  if (staticStatesData) return staticStatesData;
  
  try {
    const dataPath = path.join(__dirname, '../../frontend/src/data/indianStatesDistricts.js');
    const fileContent = fs.readFileSync(dataPath, 'utf8');
    const match = fileContent.match(/export const indianStatesAndDistricts = ({[\s\S]*?});/);
    if (match) {
      eval(`staticStatesData = ${match[1]};`);
    }
  } catch (error) {
    console.error('Error loading static states data:', error);
  }
  return staticStatesData;
};

// Convert static data to API format
const convertStaticToAPI = (staticData) => {
  if (!staticData) return [];
  
  return Object.entries(staticData).map(([name, data], index) => ({
    id: `state-${index + 1}`,
    name: name,
    type: data.type || 'State',
    active: data.active || false,
    districts: data.districts || [],
    districtCount: data.districts?.length || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
};

/**
 * Get all states and union territories
 */
exports.getAllStates = async (req, res) => {
  try {
    // Try Firebase first
    if (firestoreService.isAvailable()) {
      try {
        const states = await firestoreService.getAll('states');
        if (states && states.length > 0) {
          states.sort((a, b) => a.name.localeCompare(b.name));
          return res.json({
            success: true,
            data: states,
            count: states.length,
            source: 'firebase'
          });
        }
      } catch (firebaseError) {
        console.warn('Firebase query failed, falling back to static data:', firebaseError.message);
      }
    }
    
    // Fallback to static data
    const staticData = loadStaticData();
    if (staticData) {
      const states = convertStaticToAPI(staticData);
      states.sort((a, b) => a.name.localeCompare(b.name));
      return res.json({
        success: true,
        data: states,
        count: states.length,
        source: 'static',
        message: 'Using static data. Firebase not configured.'
      });
    }
    
    // If both fail
    return res.status(503).json({ 
      success: false,
      error: 'States data not available',
      message: 'Firebase not configured and static data not found'
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
    const { stateName } = req.params;
    let state = null;
    
    // Try Firebase first
    if (firestoreService.isAvailable()) {
      try {
        const docId = stateName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        state = await firestoreService.getById('states', docId);
        
        if (!state) {
          const states = await firestoreService.query('states', 'name', '==', stateName);
          state = states[0] || null;
        }
        
        if (state) {
          return res.json({
            success: true,
            data: {
              stateName: state.name,
              stateType: state.type,
              active: state.active,
              districts: state.districts || [],
              districtCount: state.districtCount || 0
            },
            source: 'firebase'
          });
        }
      } catch (firebaseError) {
        console.warn('Firebase query failed, falling back to static data:', firebaseError.message);
      }
    }
    
    // Fallback to static data
    const staticData = loadStaticData();
    if (staticData && staticData[stateName]) {
      const stateData = staticData[stateName];
      return res.json({
        success: true,
        data: {
          stateName: stateName,
          stateType: stateData.type || 'State',
          active: stateData.active || false,
          districts: stateData.districts || [],
          districtCount: stateData.districts?.length || 0
        },
        source: 'static',
        message: 'Using static data. Firebase not configured.'
      });
    }
    
    return res.status(404).json({ 
      success: false,
      error: 'State/UT not found' 
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


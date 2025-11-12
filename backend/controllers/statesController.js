// Firebase service - tries Firebase first, falls back to static data
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
 * Tries Firebase first, falls back to static data
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
        message: 'Using static data. Firebase not available or empty.'
      });
    }
    
    // If both fail
    return res.status(503).json({ 
      success: false,
      error: 'States data not available',
      message: 'Firebase not available and static data not found'
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a specific state/UT by name or ID
 * Tries Firebase first, falls back to static data
 */
exports.getStateByName = async (req, res) => {
  try {
    const { stateName } = req.params;
    
    // Try Firebase first
    if (firestoreService.isAvailable()) {
      try {
        const docId = stateName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        let state = await firestoreService.getById('states', docId);
        
        if (!state) {
          const states = await firestoreService.query('states', 'name', '==', stateName);
          state = states[0] || null;
        }
        
        if (state) {
          return res.json({
            success: true,
            data: state,
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
      const state = {
        id: `state-${Object.keys(staticData).indexOf(stateName) + 1}`,
        name: stateName,
        type: stateData.type || 'State',
        active: stateData.active || false,
        districts: stateData.districts || [],
        districtCount: stateData.districts?.length || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return res.json({
        success: true,
        data: state,
        source: 'static'
      });
    }
    
    return res.status(404).json({ 
      success: false,
      error: 'State/UT not found' 
    });
  } catch (error) {
    console.error('Error fetching state:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get districts for a specific state/UT
 * Tries Firebase first, falls back to static data
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
        message: 'Using static data. Firebase not available.'
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
 * Tries Firebase first, falls back to static data
 */
exports.getStatesOnly = async (req, res) => {
  try {
    // Try Firebase first
    if (firestoreService.isAvailable()) {
      try {
        const allStates = await firestoreService.getAll('states');
        if (allStates && allStates.length > 0) {
          const states = allStates.filter(s => s.type === 'State');
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
      const allStates = convertStaticToAPI(staticData);
      const states = allStates.filter(s => s.type === 'State');
      states.sort((a, b) => a.name.localeCompare(b.name));
      
      return res.json({
        success: true,
        data: states,
        count: states.length,
        source: 'static'
      });
    }
    
    return res.status(503).json({ 
      success: false,
      error: 'States data not available' 
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all union territories
 * Tries Firebase first, falls back to static data
 */
exports.getUnionTerritories = async (req, res) => {
  try {
    // Try Firebase first
    if (firestoreService.isAvailable()) {
      try {
        const allStates = await firestoreService.getAll('states');
        if (allStates && allStates.length > 0) {
          const uts = allStates.filter(s => s.type === 'Union Territory');
          uts.sort((a, b) => a.name.localeCompare(b.name));
          return res.json({
            success: true,
            data: uts,
            count: uts.length,
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
      const allStates = convertStaticToAPI(staticData);
      const uts = allStates.filter(s => s.type === 'Union Territory');
      uts.sort((a, b) => a.name.localeCompare(b.name));
      
      return res.json({
        success: true,
        data: uts,
        count: uts.length,
        source: 'static'
      });
    }
    
    return res.status(503).json({ 
      success: false,
      error: 'Union territories data not available' 
    });
  } catch (error) {
    console.error('Error fetching union territories:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create a new state/UT
 * Creates in Firebase if available
 * Only accepts: name, type, and districts
 */
exports.createState = async (req, res) => {
  try {
    const { name, type, districts } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        error: 'State/UT name and type are required'
      });
    }
    
    // Validate districts is an array if provided
    if (districts && !Array.isArray(districts)) {
      return res.status(400).json({
        success: false,
        error: 'Districts must be an array'
      });
    }
    
    // Try Firebase first
    if (firestoreService.isAvailable()) {
      try {
        const docId = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        // Check if state already exists
        const existing = await firestoreService.getById('states', docId);
        if (existing) {
          return res.status(409).json({
            success: false,
            error: 'State/UT already exists'
          });
        }
        
        const stateData = {
          name: name,
          type: type,
          districts: districts || [],
          districtCount: districts?.length || 0,
          active: false, // Default to inactive
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const created = await firestoreService.create('states', stateData, docId);
        
        return res.json({
          success: true,
          data: created,
          source: 'firebase',
          message: 'State/UT created successfully'
        });
      } catch (firebaseError) {
        console.error('Firebase create failed:', firebaseError);
        return res.status(500).json({
          success: false,
          error: 'Failed to create state in Firebase',
          message: firebaseError.message
        });
      }
    }
    
    return res.status(503).json({
      success: false,
      error: 'Firebase not available',
      message: 'Cannot create state without Firebase'
    });
  } catch (error) {
    console.error('Error creating state:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update districts for a state/UT
 * Updates Firebase if available
 */
exports.updateDistricts = async (req, res) => {
  try {
    const { stateName } = req.params;
    const { districts } = req.body;
    
    if (!districts || !Array.isArray(districts)) {
      return res.status(400).json({
        success: false,
        error: 'Districts must be an array'
      });
    }
    
    // Try Firebase first
    if (firestoreService.isAvailable()) {
      try {
        const docId = stateName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        const updateData = {
          districts: districts,
          districtCount: districts.length,
          updatedAt: new Date().toISOString()
        };
        
        const updated = await firestoreService.update('states', docId, updateData);
        
        return res.json({
          success: true,
          data: updated,
          source: 'firebase',
          message: 'Districts updated successfully'
        });
      } catch (firebaseError) {
        console.error('Firebase update failed:', firebaseError);
        return res.status(500).json({
          success: false,
          error: 'Failed to update districts in Firebase',
          message: firebaseError.message
        });
      }
    }
    
    return res.status(503).json({
      success: false,
      error: 'Firebase not available',
      message: 'Cannot update districts without Firebase'
    });
  } catch (error) {
    console.error('Error updating districts:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a state/UT
 * Deletes from Firebase if available
 */
exports.deleteState = async (req, res) => {
  try {
    const { stateName } = req.params;
    
    // Try Firebase first
    if (firestoreService.isAvailable()) {
      try {
        const docId = stateName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await firestoreService.delete('states', docId);
        
        return res.json({
          success: true,
          message: 'State/UT deleted successfully',
          source: 'firebase'
        });
      } catch (firebaseError) {
        console.error('Firebase delete failed:', firebaseError);
        return res.status(500).json({
          success: false,
          error: 'Failed to delete state from Firebase',
          message: firebaseError.message
        });
      }
    }
    
    return res.status(503).json({
      success: false,
      error: 'Firebase not available',
      message: 'Cannot delete state without Firebase'
    });
  } catch (error) {
    console.error('Error deleting state:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update state/UT active status
 * Updates Firebase if available, otherwise returns message
 */
exports.updateStateStatus = async (req, res) => {
  try {
    const { stateName } = req.params;
    const { active, secretary, unionName, established } = req.body;
    
    // Try Firebase first
    if (firestoreService.isAvailable()) {
      try {
        const docId = stateName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        const updateData = {
          updatedAt: new Date().toISOString()
        };
        
        if (active !== undefined) updateData.active = active;
        if (secretary) updateData.secretary = secretary;
        if (unionName) updateData.unionName = unionName;
        if (established) updateData.established = established;
        
        const updated = await firestoreService.update('states', docId, updateData);
        
        return res.json({
          success: true,
          data: updated,
          source: 'firebase',
          message: 'State updated in Firebase'
        });
      } catch (firebaseError) {
        console.warn('Firebase update failed:', firebaseError.message);
      }
    }
    
    // Fallback: Return update info but don't persist (static data is read-only)
    const staticData = loadStaticData();
    if (!staticData || !staticData[stateName]) {
      return res.status(404).json({ 
        success: false,
        error: 'State/UT not found' 
      });
    }
    
    return res.json({
      success: true,
      message: 'Update received but not persisted (using static data)',
      data: {
        stateName: stateName,
        active: active !== undefined ? active : staticData[stateName].active,
        secretary: secretary || null,
        unionName: unionName || null,
        established: established || null
      },
      source: 'static',
      note: 'To persist updates, ensure Firebase is configured and populated'
    });
  } catch (error) {
    console.error('Error updating state:', error);
    res.status(500).json({ error: error.message });
  }
};


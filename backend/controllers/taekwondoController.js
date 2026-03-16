const fs = require('fs');
const path = require('path');

const SETTINGS_PATH = path.join(__dirname, '../data/taekwondo-test/settings.json');
const CSV_PATH = path.join(__dirname, '../data/taekwondo-test/registrations.csv');

// Helper to escape CSV values
const escapeCSV = (val) => {
  if (val === undefined || val === null) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

// Get settings
exports.getSettings = (req, res) => {
  try {
    const settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8'));
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Error reading settings:', error);
    res.status(500).json({ success: false, error: 'Failed to read settings' });
  }
};

// Update settings (Admin)
exports.updateSettings = (req, res) => {
  try {
    const { isActive, testDate, time, venue } = req.body;
    const settings = { isActive, testDate, time, venue };
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
    res.status(200).json({ success: true, message: 'Settings updated successfully', data: settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, error: 'Failed to update settings' });
  }
};

// Submit registration
exports.submitRegistration = (req, res) => {
  try {
    const { playerName, fatherName, academyName, address, phoneNumber, dob, beltTest, transactionId } = req.body;

    // Read settings to check if form is active
    const settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8'));
    if (!settings.isActive) {
      return res.status(403).json({ success: false, error: 'Registration is currently disabled.' });
    }

    if (!playerName || !fatherName || !academyName || !address || !phoneNumber || !dob || !beltTest || !transactionId) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const submittedAt = new Date().toISOString();
    const row = [
      playerName,
      fatherName,
      academyName,
      address,
      phoneNumber,
      dob,
      beltTest,
      transactionId,
      submittedAt
    ].map(escapeCSV).join(',') + '\n';

    fs.appendFileSync(CSV_PATH, row);

    res.status(201).json({ success: true, message: 'Registration submitted successfully' });
  } catch (error) {
    console.error('Error saving registration:', error);
    res.status(500).json({ success: false, error: 'Failed to save registration' });
  }
};

// Get registrations (Admin)
exports.getRegistrations = (req, res) => {
  try {
    const data = fs.readFileSync(CSV_PATH, 'utf8');
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',');
    
    // Improved CSV parsing to handle quoted values
    const registrations = lines.slice(1).map(line => {
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && line[i+1] === '"') {
          current += '"';
          i++;
        } else if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current);
      
      const obj = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index];
      });
      return obj;
    });

    res.status(200).json({ success: true, data: registrations });
  } catch (error) {
    console.error('Error reading registrations:', error);
    res.status(500).json({ success: false, error: 'Failed to read registrations' });
  }
};

// Download CSV (Admin)
exports.downloadCSV = (req, res) => {
  try {
    res.download(CSV_PATH, 'taekwondo_registrations.csv');
  } catch (error) {
    console.error('Error downloading CSV:', error);
    res.status(500).json({ success: false, error: 'Failed to download CSV' });
  }
};

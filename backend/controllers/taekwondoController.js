const TaekwondoRegistration = require('../models/TaekwondoRegistration');
const TaekwondoSettings = require('../models/TaekwondoSettings');

const defaultSettings = {
  isActive: true,
  testDate: '29th March, 2026 (Sunday)',
  time: '9:30 Am to 1:30 Pm',
  venue: 'GM-49, 1st Floor, Pratima Bhawan, Near BSNL Chowk, Chhend, Rourkela.'
};

// Get or initialize settings from DB
const getOrCreateSettings = async () => {
  let settings = await TaekwondoSettings.findOne({ key: 'main' });
  if (!settings) {
    settings = await TaekwondoSettings.create({ key: 'main', ...defaultSettings });
  }
  return settings;
};

// GET /api/taekwondo-test/settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Error reading settings:', error);
    res.status(200).json({ success: true, data: defaultSettings }); // Fallback to default
  }
};

// PUT /api/taekwondo-test/admin/settings
exports.updateSettings = async (req, res) => {
  try {
    const { isActive, testDate, time, venue } = req.body;
    const settings = await TaekwondoSettings.findOneAndUpdate(
      { key: 'main' },
      { isActive, testDate, time, venue },
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, message: 'Settings updated successfully', data: settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, error: 'Failed to update settings' });
  }
};

// POST /api/taekwondo-test/submit
exports.submitRegistration = async (req, res) => {
  try {
    console.log('Incoming registration request:', req.body);
    const { playerName, fatherName, academyName, address, phoneNumber, dob, beltTest, transactionId } = req.body;

    // Check if form is active
    const settings = await getOrCreateSettings();
    console.log('Form active:', settings.isActive);
    if (!settings.isActive) {
      return res.status(403).json({ success: false, error: 'Registration is currently disabled.' });
    }

    if (!playerName || !fatherName || !academyName || !address || !phoneNumber || !dob || !beltTest || !transactionId) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const registration = await TaekwondoRegistration.create({
      playerName, fatherName, academyName, address, phoneNumber, dob, beltTest, transactionId
    });

    console.log('Registration saved:', registration._id);
    res.status(201).json({ success: true, message: 'Registration submitted successfully' });
  } catch (error) {
    console.error('Error saving registration:', error);
    res.status(500).json({ success: false, error: 'Failed to save registration' });
  }
};

// GET /api/taekwondo-test/admin/registrations
exports.getRegistrations = async (req, res) => {
  try {
    const registrations = await TaekwondoRegistration.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: registrations });
  } catch (error) {
    console.error('Error reading registrations:', error);
    res.status(500).json({ success: false, error: 'Failed to read registrations' });
  }
};

// GET /api/taekwondo-test/admin/download  — generates CSV on the fly from DB
exports.downloadCSV = async (req, res) => {
  try {
    const registrations = await TaekwondoRegistration.find().sort({ createdAt: -1 });

    const escapeCSV = (val) => {
      if (val === undefined || val === null) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = ['Player Name', "Father's Name", 'Academy Name', 'Address', 'Phone Number', 'DOB', 'Belt Test', 'Transaction ID', 'Submitted At'];
    const rows = registrations.map(r => [
      r.playerName, r.fatherName, r.academyName, r.address,
      r.phoneNumber, r.dob, r.beltTest, r.transactionId,
      r.createdAt?.toISOString() || ''
    ].map(escapeCSV).join(','));

    const csv = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="taekwondo_registrations.csv"');
    res.send(csv);
  } catch (error) {
    console.error('Error downloading CSV:', error);
    res.status(500).json({ success: false, error: 'Failed to download CSV' });
  }
};

const path = require('path');
const os = require('os');
let QRCode;
try {
  QRCode = require('qrcode');
} catch (e) {
  QRCode = require('../backend/node_modules/qrcode');
}

const targetUrl = process.env.AFFILIATION_VERIFY_URL || process.argv[2] || 'https://www.taekwondounion.com/verify-affiliation';
const outputPath = path.join(os.homedir(), 'Desktop', 'affiliation-verify-qr.png');

console.log(`Generating static QR code for affiliation verification URL: ${targetUrl}`);

QRCode.toFile(
  outputPath,
  targetUrl,
  {
    color: {
      dark: '#0B2545', // Dark navy blue from ITU theme
      light: '#FFFFFF'
    },
    width: 600,
    margin: 2
  },
  (err) => {
    if (err) {
      console.error('Error generating affiliation QR code:', err);
      process.exit(1);
    }
    console.log(`✅ Affiliation QR Code PNG successfully generated and saved to:\n${outputPath}`);
  }
);

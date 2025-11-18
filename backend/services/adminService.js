// const Admin = require('../models/Admin');
// const bcrypt = require('bcrypt');

// exports.loginAdmin = async ({ email, password }) => {
//   const admin = await Admin.findOne({ email });
//   if (!admin) throw new Error('Invalid email');

//   const isMatch = await bcrypt.compare(password, admin.password);
//   if (!isMatch) throw new Error('Invalid password');

//   return admin;
// };










const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

exports.loginAdmin = async ({ email, password }) => {
  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) throw new Error('Invalid email');

  // Check if password is hashed (starts with $2b$) or plain text
  const isPasswordValid = admin.password.startsWith('$2b$')
    ? await bcrypt.compare(password, admin.password)
    : password === admin.password;

  if (!isPasswordValid) throw new Error('Invalid password');

  // If password was plain text, hash it for future use
  if (!admin.password.startsWith('$2b$')) {
    admin.password = await bcrypt.hash(password, 10);
    await admin.save();
  }

  // Remove password from returned object
  const adminObj = admin.toObject();
  delete adminObj.password;
  return adminObj;
};



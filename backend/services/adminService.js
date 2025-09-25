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

exports.loginAdmin = async ({ email, password }) => {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error('Invalid email');

  // Direct plain-text comparison
  if (password !== admin.password) throw new Error('Invalid password');

  return admin;
};



// utils/passwordGenerator.js
const generatePassword = (state) => {
  const cleanStateName = state.replace(/\s+/g, '').toLowerCase();
  return `${cleanStateName}ITU@540720`;
};

module.exports = generatePassword;
const BELT_RANKS = [
  "White",
  "White One",
  "Yellow",
  "Yellow One",
  "Green",
  "Green One",
  "Blue",
  "Blue One",
  "Red",
  "Red One",
  "1st Dan Black Belt",
  "2nd Dan Black Belt",
  "3rd Dan Black Belt",
  "4th Dan Black Belt",
  "5th Dan Black Belt",
  "6th Dan Black Belt",
  "7th Dan Black Belt",
  "8th Dan Black Belt",
  "9th Dan Black Belt"
];

/**
 * Returns rank index for a given belt rank string (-1 if not found)
 */
const getRankIndex = (beltLevel) => {
  if (!beltLevel || typeof beltLevel !== 'string') return -1;
  const normalized = beltLevel.trim().toLowerCase().replace(/\s+/g, ' ');
  return BELT_RANKS.findIndex(r => r.toLowerCase() === normalized);
};

module.exports = {
  BELT_RANKS,
  getRankIndex
};

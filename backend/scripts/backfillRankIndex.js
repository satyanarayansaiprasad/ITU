const mongoose = require('mongoose');
require('dotenv').config();

const Player = require('../models/Players');
const { getRankIndex } = require('../config/beltRanks');

const backfillRankIndex = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/itu';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    const players = await Player.find({});
    console.log(`Found ${players.length} players to check/backfill.`);

    let updatedCount = 0;
    for (const player of players) {
      const calculatedIndex = getRankIndex(player.beltLevel);
      if (calculatedIndex !== -1 && player.rankIndex !== calculatedIndex) {
        player.rankIndex = calculatedIndex;
        await player.save();
        updatedCount++;
      }
    }

    console.log(`Successfully updated rankIndex for ${updatedCount} players.`);
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('Error backfilling rankIndex:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  backfillRankIndex();
}

module.exports = backfillRankIndex;

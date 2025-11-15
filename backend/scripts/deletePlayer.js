const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Player = require('../models/Players');

const deletePlayer = async () => {
  try {
    // Connect to MongoDB using the same connection string as the app
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGO_URI or MONGODB_URI not found in environment variables');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Find all players
    const players = await Player.find({});
    console.log(`\nFound ${players.length} player(s):`);
    players.forEach((player, index) => {
      console.log(`${index + 1}. ${player.name} (${player.email}) - ID: ${player._id}`);
    });

    if (players.length === 0) {
      console.log('No players found to delete.');
      await mongoose.connection.close();
      return;
    }

    // Delete all players
    const result = await Player.deleteMany({});
    console.log(`\n✅ Deleted ${result.deletedCount} player(s) successfully.`);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error deleting player:', error);
    process.exit(1);
  }
};

deletePlayer();


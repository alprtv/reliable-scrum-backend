const mongoose = require('mongoose');
const Logger = new require('../logger');
const logger = new Logger();
const config = require('../config');

mongoose.Promise = require('bluebird');
mongoose.connect(config.mongoUri, {
  useMongoClient: true,
  poolSize: 10,
});

mongoose.connection.on('error', (err) => {
  logger.error("Database Connection Error: " + err);
  logger.error('MongoDB dosent start!');
  process.exit(2);
});

mongoose.connection.on('connected',() => {
  logger.info("Succesfully connected to MongoDB Database");
});


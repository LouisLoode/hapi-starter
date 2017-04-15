import Mongoose from 'mongoose';

// Configurations
const config = require('./config');
Mongoose.connect(config.mongodb);

const db = Mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error'));
db.once('open', () => {

    console.log('Connection with Mongodb succeeded');
    
});

module.exports = db;

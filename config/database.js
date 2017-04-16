import mongoose from 'mongoose';
import config from './config';

console.log('config.mongodb: '+config.mongodb);

mongoose.connect(config.mongodb);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error'));
db.once('open', () => {

    if (process.env.NODE_ENV !== 'test'){
        console.log('Connection with Mongodb succeeded');
    }

});

module.exports = db;

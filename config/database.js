import Mongoose from 'mongoose';
import BlueBird from 'bluebird';
import Config from './config';

console.log(Config.mongodb);

// connect mongo
// Mongoose.Promise = global.Promise;
Mongoose.Promise = BlueBird;
Mongoose.connect(Config.mongodb);

// When successfully connected
Mongoose.connection.on('connected', () => {

    console.log('Mongoose default connection open to ' + Config.mongodb);

});

// If the connection throws an error
Mongoose.connection.on('error', (err) => {

    console.log('Mongoose default connection error: ' + err);

});

// When the connection is disconnected
Mongoose.connection.on('disconnected', () => {

    console.log('Mongoose default connection disconnected');

});

// When the connection is open
Mongoose.connection.on('open', () => {

    console.log('Mongoose default connection is open');

});

module.exports = Mongoose;

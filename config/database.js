import mongoose from 'mongoose';
import Config from './config';

// connect mongo
mongoose.connect(Config.mongodb);

// When successfully connected
mongoose.connection.on('connected', () => {

    console.log('Mongoose default connection open to ' + Config.mongodb);

});

// If the connection throws an error
mongoose.connection.on('error', (err) => {

    console.log('Mongoose default connection error: ' + err);

});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {

    console.log('Mongoose default connection disconnected');

});

// When the connection is open
mongoose.connection.on('open', () => {

    console.log('Mongoose default connection is open');

});

module.exports = mongoose;

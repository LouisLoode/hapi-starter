import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Boom from 'boom';
import UserModel from '../models/user';
import config from '../../config/config';

const authHandler = module.exports = {};

// Configurations files

authHandler.createToken = (user) => {

    return jwt.sign({ id: user.id, username: user.username, email: user.email }, config.key.privateKey, { algorithm: 'HS256', expiresIn: '1h' } );

};

authHandler.verifyCredentials = (req, res) => {

    const password = req.payload.password;
    // Find an entry from the database that
    // matches either the email or username
    UserModel.findOne({
        $or: [
            { email: req.payload.email },
            { username: req.payload.username }
        ]
    }, (err, user) => {

        if (err){
            res(Boom.badRequest(err));
        }
        else {
            if (user) {
                const auth = user.authenticate(password, user.password);
                if (!auth) {
                    res(Boom.badRequest('Incorrect password!'));
                }
                else {
                    res(user);
                }
            }
            else {
                res(Boom.badRequest('Incorrect username or email!'));
            }
        }

    });
};

authHandler.hashPassword = (password, cb) => {

    // Generate a salt at level 10 strength
    bcrypt.genSalt(10, (err, salt) => {

        if (err){
            return cb(err);
        }

        bcrypt.hash(password, salt, (err, hash) => {

            return cb(err, hash);
        });

    });
};

authHandler.getProfile = (req, res) => {

    //Fetch all data from mongodb User Collection
    UserModel.findOne({ _id: req.auth.crendentials._id }, (error, data) => {

        if (error) {
            res(Boom.serverUnavailable('Failed to get data', error));
        }
        else {
            if (data.length === 0) {
                res(Boom.notFound('User Not Found', data));
            }
            else {
                res({ statusCode: 200, message: 'User Data Successfully Fetched', data: data });
            }
        }
    });
};

authHandler.registerUser = (req, res) => { // Create mongodb user object to save it into database

    console.log(req.payload);
    const user = new UserModel(req.payload); // Call save methods to save data into database
    // and pass callback methods to handle error

    user.username = req.payload.username;
    user.email = req.payload.email;
    authHandler.hashPassword(req.payload.password, (err, hash) => {

        if (err) {
            throw Boom.badRequest(err);
        }
        user.password = hash;
        user.save((err, data) => {

            if (err) {
                throw Boom.badRequest(err);
            }
            else {
                // If the user is saved successfully, issue a JWT
                res({ statusCode: 201, message: 'User Register Successfully', data:data, token: authHandler.createToken(user) }).code(201);
            }
        });
    });
};
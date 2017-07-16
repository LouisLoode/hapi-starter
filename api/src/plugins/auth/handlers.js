
const Bcrypt = require('bcryptjs');
const Boom = require('boom');
const UserModel = require('../../models/user');
const AuthUtils = require('./utils.js');

const authHandler = {

    verifyCredentials(req, res) {

        const password = req.payload.password;
        UserModel.findOne({ email: req.payload.email }, (err, user) => {

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
                    res(Boom.badRequest('Incorrect email!'));
                }
            }

        });
    },

    hashPassword(password, cb) {

        // Generate a salt at level 10 strength
        Bcrypt.genSalt(10, (err, salt) => {

            if (err){
                return cb(err);
            }

            Bcrypt.hash(password, salt, (err, hash) => {

                return cb(err, hash);
            });

        });
    },

    getProfile(req, res) {

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
                    res({ statusCode: 200, message: 'User Data Successfully Fetched', data });
                }
            }
        });
    },

    registerUser(req, res) { // Create mongodb user object to save it into database

        // and pass callback methods to handle error
        if (req.payload.password !== req.payload.password2){
            res(Boom.badRequest('passwords are differents'));
        }
        else {
            const user = new UserModel(req.payload); // Call save methods to save data into database
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
                        // If the user is saved successfully, issue a Jwt
                        res({ statusCode: 201, message: 'User Register Successfully', data, token: AuthUtils.createJwt(user) }).code(201);
                    }
                });
            });
        }
    }

};

module.exports = authHandler;

import Boom from 'boom';
import UserModel from '../models/user';

const userHandler = module.exports = {};

userHandler.verifyUniqueUser = (req, res) => {

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
            // Check whether the username or email
            // is already taken and error out if so
            if (user) {
                if (user.username === req.payload.username) {
                    res(Boom.badRequest('Username taken'));
                }
                else if (user.email === req.payload.email) {
                    res(Boom.badRequest('Email taken'));
                }
            }
            else {
                // If everything checks out, send the payload through
                // to the route handler
                res(req.payload);
            }
        }
    });
};

userHandler.deleteOneUser = (req, res) => {

    //Fetch all data from mongodb User Collection
    UserModel.findOneAndRemove({ _id: req.auth.crendentials._id }, (error, data) => {

        if (error) {
            res(Boom.serverUnavailable('Failed to delete data', error));
        }
        else {
            if (data === null){
                res(Boom.notFound('Message Not Found'));
            }
            else {
                res({ statusCode: 200, message: 'User Successfully Deleted', data: data });
            }
        }
    });
};

userHandler.getAllUsers = (req, res) => {

    //Fetch all data from mongodb User Collection
    UserModel.find({}, (error, data) => {

        if (error) {
            res(Boom.serverUnavailable('Failed to get data', error));
        }
        else {
            res({
                statusCode: 200,
                message: 'Users Data Successfully Fetched',
                data: data
            });
        }
    });
};

userHandler.getOneUser = (req, res) => {

    //Fetch all data from mongodb User Collection
    UserModel.findOne({ _id: req.params.id }, (error, data) => {

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

userHandler.putOneUser = (req, res) => { // Create mongodb user object to save it into database

    // and pass callback methods to handle error
    UserModel.findByIdAndUpdate(req.auth.crendentials._id, req.payload, { new: true, upsert:true }, (error, data) => {

        if (error) {
            res(Boom.serverUnavailable('Failed to put a message', error));
        }
        else {
            res({ statusCode: 200, message: 'User Saved Successfully', data: data });
        }
    });
};

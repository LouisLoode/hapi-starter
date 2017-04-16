'use strict';

import Boom from 'boom';
import mongoose from 'mongoose';
import UserModel from '../models/user';

export function verifyUniqueUser(req, res) {
  // Find an entry from the database that
  // matches either the email or username
  UserModel.findOne({
    $or: [
      { email: req.payload.email },
      { username: req.payload.username }
    ]
  }, (err, user) => {
    // Check whether the username or email
    // is already taken and error out if so
    if (user) {
      if (user.username === req.payload.username) {
        res(Boom.badRequest('Username taken'));
      }else if (user.email === req.payload.email) {
        res(Boom.badRequest('Email taken'));
      }
    } else {
      // If everything checks out, send the payload through
      // to the route handler
      res(req.payload);
    }
  });
};

export function verifyCredentials(req, res) {
  const password = req.payload.password;
  // Find an entry from the database that
  // matches either the email or username
  UserModel.findOne({
    $or: [
      { email: req.payload.email },
      { username: req.payload.username }
    ]
  }, (err, user) => {
    if (user) {
      var auth = user.authenticate(password, user.password);
      if(!auth){
        res(Boom.badRequest('Incorrect password!'));
      } else {
        res(user);
      }
    } else {
      res(Boom.badRequest('Incorrect username or email!'));
    }
  });
};

export function deleteOneUser(req, res) {
    //Fetch all data from mongodb User Collection
    UserModel.findOneAndRemove({_id: req.auth.crendentials._id}, (error, data) => {
      if (error) {
        res(Boom.serverUnavailable('Failed to delete data', error));
      } else {
        if(data === null){
          res(Boom.notFound('Message Not Found'));
        } else {
          res({ statusCode: 200, message: 'User Successfully Deleted', data: data });
        }
      }
    });
}

export function getAllUsers(req, res) {
    //Fetch all data from mongodb User Collection
    UserModel.find({}, (error, data) => {
        if (error) {
            res(Boom.serverUnavailable('Failed to get data', error));
        } else {
            res({
                statusCode: 200,
                message: 'Users Data Successfully Fetched',
                data: data
            });
        }
    });
}

export function getOneUser(req, res) {
    //Fetch all data from mongodb User Collection
    UserModel.findOne({_id: req.params.id}, (error, data) => {
      if (error) {
        res(Boom.serverUnavailable('Failed to get data', error));
      } else {
        if (data.length === 0) {
          res(Boom.notFound('User Not Found', data));
        } else {
          res({ statusCode: 200, message: 'User Data Successfully Fetched', data: data });
        }
      }
    });
}

export function putOneUser(req, res) { // Create mongodb user object to save it into database

  // and pass callback methods to handle error
  UserModel.findByIdAndUpdate(req.auth.crendentials._id, req.payload, {new: true, upsert:true}, (error, data) => {
    if (error) {
      res(Boom.serverUnavailable('Failed to put a message', error));
    } else {
      res({ statusCode: 200, message: 'User Saved Successfully', data: data });
    }
  });
}

import jwt from 'jsonwebtoken';
import Boom from 'boom';
import mongoose from 'mongoose';
import UserModel from '../models/user';
import config from '../../config/config';

// Configurations files

export function createToken(user) {
  let scopes;
  // Check if the user object passed in
  // has admin set to true, and if so, set
  // scopes to admin
  // if (user.rights.type) {
  //   scopes = 'admin';
  // }
  // Sign the JWT
  // return jwt.sign({ id: user._id, username: user.username, email: user.email, scope: scopes }, parameters.key.privateKey, { algorithm: 'HS256', expiresIn: "1h" } );
  return jwt.sign({ id: user.id, username: user.username, email: user.email }, config.key.privateKey, { algorithm: 'HS256', expiresIn: "1h" } );
}

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

export function getProfile(req, res) {
  //Fetch all data from mongodb User Collection
  UserModel.findOne({_id: req.auth.crendentials._id}, (error, data) => {
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

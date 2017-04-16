import jwt from 'jsonwebtoken';
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

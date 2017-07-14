const Jwt = require('jsonwebtoken');
const Config = require('../../../config/config');

// @TODO
exports.createJwt = (profile) => {

  // sign asynchronously
    return Jwt.sign({ id: profile.id, username: profile.username, email: profile.email },
      Config.key.privateKey, { algorithm: 'HS256', expiresIn: '1h' }
    );
};

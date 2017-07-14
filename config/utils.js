const crypto = require('crypto');

exports.randomString = (size) => {
  console.log(size);
    const result = crypto.randomBytes(size).toString('hex');
    console.log(result);
    return result;
};

// http://stackoverflow.com/a/29951992
exports.isSubsetInArray = (source, target) => {

    return !_.difference(_.flatten(source), _.flatten(target)).length;

};

exports.isValidObjectID = (str) => {

    // coerce to string so the function can be generically used to test both strings and native objectIds created by the driver
    str = str + '';
    const len = str.length;
    let valid = false;

    if (len === 12 || len === 24) {
        valid = /^[0-9a-fA-F]+$/.test(str);
    }
    return valid;

};

//@TODO
// exports.createJwt = (profile) => {
//
//   // sign asynchronously
//     return jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256' }, function(err, token) {
//       console.log(token);
//     });
//     return jwt.sign(profile, config.server.secret, {
//         expiresIn: '2h'
//     });
// };

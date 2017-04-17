import UserModel from '../src/models/user';

const policies = module.exports = {};

policies.Jwt = (decoded, request, callback) => {

    UserModel.findOne({ _id: decoded.id }).then((user) => {

        if (user) {
            request.auth.crendentials = user.toObject();
            return callback(null, true);
        }
        return callback(null, false);
    });

};

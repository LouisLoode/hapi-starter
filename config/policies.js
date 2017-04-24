import UserModel from '../src/models/user';

const policies = module.exports = {};

policies.Jwt = (decoded, request, callback) => {

    UserModel.findOne({ _id: decoded.id }).then((user, err) => {
        if(err){
            console.log(err);
        }
        if (user) {
            request.auth.crendentials = user.toObject();
            return callback(null, true);
        }
        else {
            return callback(null, false);
        }

    });

};

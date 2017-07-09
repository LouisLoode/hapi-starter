const AuthHandler = require('../handlers');
const UserHandler = require('../../user/handlers');
const Joi = require('joi');

module.exports = {
    method: 'POST',
    path: '/v1/auth/register',
    config: { // "tags" enable swagger to document API
        auth: false,
        pre: [
            { method: UserHandler.verifyUniqueUser }
        ],
        tags: ['api'],
        description: 'Save user data',
        notes: 'Save user data', // We use Joi plugin to validate request
        validate: {
            payload: { // Both name and age are required fields
                username: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().required(),
                password2: Joi.string().required()
            }
        }
    },
    handler: AuthHandler.registerUser
};

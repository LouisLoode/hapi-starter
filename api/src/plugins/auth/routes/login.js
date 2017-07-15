const AuthUtils = require('../utils');
const AuthHandler = require('../handlers');
const Joi = require('joi');

module.exports = {
    method: 'POST',
    path: '/v1/auth/login',
    config: {
        auth: false,
        // Check the user's password against the DB
        pre: [
            { method: AuthHandler.verifyCredentials, assign: 'user' }
        ],
        // Include this API in swagger documentation
        tags: ['api'],
        description: 'Login an user',
        notes: 'Login an user',
        validate: {
            payload: Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().required()
            })
        }
    },
    handler(request, reply) {

        reply({ statusCode: 201, message: 'User Login Successfully', data:request.pre.user, token: AuthUtils.createJwt(request.pre.user) }).code(201);
    }
};

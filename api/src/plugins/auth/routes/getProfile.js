const AuthHandler = require('../handlers');
const Joi = require('joi');

module.exports = {
    method: 'GET',
    path: '/v1/auth/profile',
    config: {
        // Include this API in swagger documentation
        tags: ['api'],
        description: 'Get One User data',
        notes: 'Get Profile User Authed',
        validate: {
            headers: Joi.object({
                'authorization': Joi.string().required()
            }).unknown()
        }
    },
    handler: AuthHandler.getProfile
};

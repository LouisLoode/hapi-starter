const UserHandler = require('../handlers');
const Joi = require('joi');

module.exports = {
    method: 'GET',
    path: '/v1/users',
    config: {
        // Include this API in swagger documentation
        auth: 'jwt',
        // auth: false,
        tags: ['api'],
        description: 'Get All Users',
        notes: 'Get All Users',
        cache: {
            expiresIn: 15 * 1000,
            privacy: 'private'
        },
        validate: {
            headers: Joi.object({
                'authorization': Joi.string().required()
            }).unknown()
        }
    },
    handler: UserHandler.getAllUsers
};

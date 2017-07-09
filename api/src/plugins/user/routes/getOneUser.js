const UserHandler = require('../handlers');
const Joi = require('joi');

module.exports = {
    method: 'GET',
    path: '/v1/users/{id}',
    config: {
        // Include this API in swagger documentation
        auth: 'jwt',
        tags: ['api'],
        description: 'Get One User data',
        notes: 'Get One User data',
        validate: {
            params: {
                id: Joi.string().required()
            },
            headers: Joi.object({
                'authorization': Joi.string().required()
            }).unknown()
        }
    },
    handler: UserHandler.getOneUser
};

const UserHandler = require('../handlers');
const Joi = require('joi');

module.exports = {
    method: 'DELETE',
    path: '/v1/users',
    config: {
        // Include this API in swagger documentation
        auth: 'jwt',
        tags: ['api'],
        description: 'Delete One User',
        notes: 'Delete One User',
        validate: {
            headers: Joi.object({
                'authorization': Joi.string().required()
            }).unknown()
        }
    },
    handler: UserHandler.deleteOneUser
};

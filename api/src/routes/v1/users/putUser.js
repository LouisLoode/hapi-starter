const UserHandler = require('../../../handlers/userHandler');
const Joi = require('joi');

module.exports = {
    method: 'PUT',
    path: '/v1/users',
    config: { // "tags" enable swagger to document API
        auth: 'jwt',
        tags: ['api'],
        description: 'Update user data',
        notes: 'Update user data', // We use Joi plugin to validate request
        validate: {
            payload: { // Both name and age are required fields
                username: Joi.string(),
                email: Joi.string().email(),
                infos: Joi.object().keys({
                    description: Joi.string(),
                    location: Joi.string(),
                    website: Joi.string()
                })
            },
            headers: Joi.object({
                'authorization': Joi.string().required()
            }).unknown()
        }
    },
    handler: UserHandler.putOneUser
};

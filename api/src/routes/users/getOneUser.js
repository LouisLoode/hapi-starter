import { getOneUser } from '../../handlers/userHandler';
import Joi from 'joi';

module.exports = {
    method: 'GET',
    path: '/users/{id}',
    config: {
        // Include this API in swagger documentation
        tags: ['api'],
        description: 'Get One User data',
        notes: 'Get One User data',
        validate: {
            params: {
                id: Joi.string().required()
            }
        }
    },
    handler: getOneUser
};

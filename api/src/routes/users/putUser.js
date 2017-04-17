import { putOneUser } from '../../handlers/userHandler';
import Joi from 'joi';

module.exports = {
    method: 'PUT',
    path: '/users',
    config: { // "tags" enable swagger to document API
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
            }
        }
    },
    handler: putOneUser
};

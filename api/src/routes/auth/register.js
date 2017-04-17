import { registerUser } from '../../handlers/authHandler';
import { verifyUniqueUser } from '../../handlers/userHandler';
import Joi from 'joi';

module.exports = {
    method: 'POST',
    path: '/auth/register',
    config: { // "tags" enable swagger to document API
        auth: false,
        pre: [
            { method: verifyUniqueUser }
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
    handler: registerUser
};

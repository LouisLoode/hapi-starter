import { createToken, verifyCredentials } from '../../handlers/authHandler';
import Joi from 'joi';

module.exports = {
    method: 'POST',
    path: '/auth/login',
    config: {
        auth: false,
        // Check the user's password against the DB
        pre: [
            { method: verifyCredentials, assign: 'user' }
        ],
        // Include this API in swagger documentation
        tags: ['api'],
        description: 'Login an user',
        notes: 'Login an user',
        validate: {
            payload: Joi.alternatives().try(
                Joi.object({
                    username: Joi.string().alphanum().min(2).max(30).required(),
                    password: Joi.string().required()
                }),
                Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().required()
                })
            )
        }
    },
    handler: (request, reply) => {

        reply({ statusCode: 201, message: 'User Login Successfully', data:request.pre.user, token: createToken(request.pre.user) }).code(201);
    }
};

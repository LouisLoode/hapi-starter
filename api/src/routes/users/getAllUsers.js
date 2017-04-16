import {getAllUsers} from '../../handlers/userHandler';

module.exports = {
    method: 'GET',
    path: '/users',
    config: {
        // Include this API in swagger documentation
        // auth: 'jwt',
        // auth: false,
        tags: ['api'],
        description: 'Get All Users',
        notes: 'Get All Users',
        cache: {
            expiresIn: 15 * 1000,
            privacy: 'private'
        }
    },
    handler: getAllUsers
};

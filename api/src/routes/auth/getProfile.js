import { getProfile } from '../../handlers/authHandler';

module.exports = {
    method: 'GET',
    path: '/auth/profile',
    config: {
        // Include this API in swagger documentation
        tags: ['api'],
        description: 'Get One User data',
        notes: 'Get Profile User Authed'
    },
    handler: getProfile
};

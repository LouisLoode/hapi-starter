import {deleteOneUser} from '../../handlers/userHandler';

module.exports = {
    method: 'DELETE',
    path: '/users',
    config: {
        // Include this API in swagger documentation
        tags: ['api'],
        description: 'Delete One User',
        notes: 'Delete One User'
    },
    handler: deleteOneUser
};

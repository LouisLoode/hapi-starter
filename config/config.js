if (process.env.NODE_ENV !== 'production'){
    console.log('NODE_ENV : ' + process.env.NODE_ENV);
}

module.exports = {
    env: process.env.NODE_ENV || 'development',
    api: {
        host: process.env.API_HOST || 'localhost',
        port: process.env.API_PORT || 8000
    },
    worker: {
        host: process.env.WORKER_HOST || 'localhost',
        port: process.env.WORKER_PORT || 8080
    },
    mongodb: process.env.MONGODB_URI || 'mongodb://localhost:27017/debug',
    rabbitmq: process.env.RABBIT_URI || 'amqp://localhost',
    key: {
        privateKey: process.env.PRIVATE_KEY || 'YourPrivateKey',
        tokenExpiration: process.env.TOKEN_EXPIRATION || 3600000,
        tokenExpirationDescription: process.env.TOKEN_EXPIRATION_DESCRIPTION || '1 hour'
    },
    facebook: {
        redirect_uri: 'http://' + process.env.API_HOST + ':' + process.env.API_PORT + '/connect/facebook/callback',
        key: process.env.FACEBOOK_KEY,
        secret: process.env.FACEBOOK_SECRET,
        callback: '/auth/handle_facebook',
        scope: [
            'public_profile',
            'email',
            'user_friends'
        ]
    }
};

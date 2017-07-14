if (process.env.NODE_ENV === undefined) {
    process.env.NODE_ENV = 'development';
}
if (process.env.NODE_ENV !== 'production'){
    console.log('NODE_ENV : ' + process.env.NODE_ENV);
}
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
    require('dotenv').config({ path: './env/' + process.env.NODE_ENV + '.env' });
}

module.exports = {
    env: process.env.NODE_ENV || 'development',
    api: {
        host: process.env.API_HOST || 'localhost',
        port: process.env.API_PORT || '8000'
    },
    worker: {
        host: process.env.WORKER_HOST || 'localhost',
        port: process.env.WORKER_PORT || '9000'
    },
    mongodb: process.env.MONGODB_URI || 'mongodb://mongodb:27017/hapi-dev-debug',
    rabbitmq: process.env.RABBITMQ_URI || 'amqp://rabbitmq',
    key: {
        privateKey: process.env.PRIVATE_KEY || 'YourPrivateKey',
        tokenExpiration: process.env.TOKEN_EXPIRATION || 3600000,
        tokenExpirationDescription: process.env.TOKEN_EXPIRATION_DESCRIPTION || '1 hour'
    },
    mailjet: {
        email: 'louisdebraine@gmail.com',
        key: process.env.MAILJET_KEY,
        secret: process.env.MAILJET_SECRET,
    },
    facebook: {
        redirect_uri: 'http://' + process.env.API_HOST + ':' + process.env.API_PORT + '/connect/facebook/callback',
        key: process.env.FACEBOOK_KEY,
        secret: process.env.FACEBOOK_SECRET,
        callback: '/v1/auth/facebook/handler',
        scope: [
            'public_profile',
            'email',
            'user_friends'
        ]
    },
    twitter: {
      redirect_uri: 'http://' + process.env.API_HOST + ':' + process.env.API_PORT + '/connect/twitter/callback',
      key: process.env.TWITTER_KEY,
      secret: process.env.TWITTER_SECRET,
      callback: '/v1/auth/twitter/handler'
    }
};

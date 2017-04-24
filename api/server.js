// Import dependencies
import Hapi from 'hapi';
import Blipp from 'blipp';
import Good from 'good';
import Inert from 'inert';
import Vision from 'vision';

import HapiAuthJwt2 from 'hapi-auth-jwt2';

import glob from 'glob';
import path from 'path';

// Import configuration
import policies from './config/policies';
import Config from './config/config';
import Swagger from './config/swagger';
// import RabbitMQ from './config/rabbitmq';

const server = module.exports = new Hapi.Server();

// Import database
import './config/database';

// bootstrap models
glob.sync('src/models/*.js', {
    root: __dirname,
    ignore: 'src/models/**/*.spec.js'
}).forEach((file) => {

    require(path.join(__dirname, file));

});

server.connection({
    port: 8000,
    routes: {
        cors: true
    }
});

if (process.env.NODE_ENV === 'development') {
    server.register([
        Inert,
        Vision,
        Swagger
    ]);
}

// Logger
if (process.env.NODE_ENV !== 'test') {
    server.register({
        register: Good,
        options: {
            reporters: {
                console: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{
                        log: '*',
                        response: '*'
                    }]
                }, {
                    module: 'good-console'
                }, 'stdout'
                ]
            }
        }
    }, (err) => {

        if (err) {
            console.error(err);
        }

    });
}

// server.register(RabbitMQ);

server.register(HapiAuthJwt2, () => {
    // Define strategy
    server.auth.strategy('jwt', 'jwt',{
        key: process.env.JWT_KEY,
        verifyFunc: policies.Jwt
    });

    server.auth.default('jwt');

    if (process.env.NODE_ENV !== 'production'){
        console.log('ROUTING :');
    }

    // Load routes
    glob.sync('src/routes/**/*.js', {
        root: __dirname,
        ignore: 'src/routes/**/*.spec.js'
    }).forEach((file) => {

        const route = require(path.join(__dirname, file));
        server.route(route);

    });

    if (process.env.NODE_ENV !== 'test') {
        server.register({ register: Blipp, options: { showAuth : true } }, (err) => {

            if (err) {
                console.error('Error was handled!');
                console.error(err);
            }

            server.start((err) => {

                if (err) {
                    console.error('Error was handled!');
                    console.error(err);
                }
                console.log(`Server started at ${server.info.uri}`);
                console.log(`Environment ${Config.env}`);

            });

        });
    }
});

// Import dependencies
import Hapi from 'hapi';
import Rabbit from 'hapi-rabbit';
import glob from 'glob';
import path from 'path';

// Import configuration
import Config from './config/config';

const server = module.exports = new Hapi.Server();

import './config/database';

// bootstrap models
glob.sync('src/models/*.js', {
    root: __dirname
}).forEach((file) => {

    require(path.join(__dirname, file));

});

server.connection(
    {
        port: '9090'
    }
);
console.log('Config.rabbitmq : ' + Config.rabbitmq);
server.register({
    register: Rabbit,
    options: {
        url: Config.rabbitmq
    }
}, (err) => {

    if (err) {
        console.log(['error'], 'hapi-rabbit load error: ' + err);
    }
    else {
        console.log(['start'], 'hapi-rabbit interface loaded');
    }

});

server.start((err) => {
    if (err) {
      // Fancy error handling here
        console.error('Error was handled!');
        console.error(err);
    }

    var rabbit = server.plugins['hapi-rabbit'];
    rabbit.createContext((err, context) => {

        if(err){
            console.log('err', err);
        }

        glob.sync('src/queues/**/*.js', {
            root: __dirname,
            ignore: 'src/queues/**/*.spec.js'
        }).forEach((file) => {

        const queue = require(path.join(__dirname, file));
        // rabbit.subscribe(queue);

        });

        rabbit.subscribe(context, 'exchange', function(err, message){
            console.log('message', message);
        });
    });

    console.log(`Server started at ${server.info.uri}`);
    // console.log(`Environment ${Config.env}`);
});

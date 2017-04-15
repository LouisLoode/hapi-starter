// Import dependencies
import Hapi from 'hapi';
import Good from 'good';
import Inert from 'inert';
import Vision from 'vision';

import glob from 'glob';
import path from 'path';

// Import configuration
import config from './config/config';
import database from './config/database';
import Swagger from './config/swagger';

const server = module.exports = new Hapi.Server();
// const routes = [];

server.connection({ port: 8000 });

if (process.env.NODE_ENV === 'development') {
  server.register([
    Inert,
    Vision,
    Swagger,
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
            response: '*',
          }],
        }, {
          module: 'good-console',
        }, 'stdout',
        ],
      },
    },
  }, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

glob.sync('src/routes/**/*.js', {
  root: __dirname
}).forEach(file => {
  let route = require(path.join(__dirname, file));
  server.route(route);
  if(process.env.NODE_ENV != 'production'){
    console.log(''+route.method+' '+route.path+'  (file:  '+file+')');
  }
});


if (!module.parent) {
  server.start((err) => {
    if (err) {
      // Fancy error handling here
      console.error('Error was handled!');
      console.error(err);
    }
    console.log(`Server started at ${server.info.uri}`);
    console.log(`Environment ${config.env}`);
  });
}

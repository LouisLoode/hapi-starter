const amqp = require('amqp');
const Config = require('./config/config');
const RabbitMQ = amqp.createConnection({ url: Config.rabbitmq });
const glob = require('glob');
const path = require('path');

// add this for better debuging
RabbitMQ.on('error', (error) => {
  console.log('Error from amqp: ', error);
});

// Wait for connection to become established.
RabbitMQ.on('ready', () => {
  // Use the default 'amq.topic' exchange
  glob.sync('src/queues/**/*.js', {
    root: __dirname
  }).forEach(file => {
    const job = require(path.join(__dirname, file));
    const name = path.basename(file, '.js');
    const options = {
      durable: true,
      autoDelete: false
    };
    RabbitMQ.queue(name, options, job);

      console.log('Register queue: '+name+' (file:  '+file+')');
  });

});

const Amqp = require('amqp');
const Config = require('./config');
module.exports = Amqp.createConnection({ url: Config.rabbitmq });

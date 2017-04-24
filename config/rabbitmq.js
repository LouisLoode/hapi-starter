import amqp from 'amqp';
import Config from './config';
module.exports = amqp.createConnection({ url: Config.rabbitmq });

import RabbitMQ from '../../config/rabbitmq';

const workerService = {

    // Configurations files
    test(body) {
        let options = {
            deliveryMode: 2, // Non-persistent (1) or persistent (2)
            priority: 0, // 0 to 9
            contentType: 'application/json'
        };
        RabbitMQ.publish('email', body, options);
    }
};

module.exports = workerService;

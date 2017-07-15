const RabbitMQ = require('../../../../config/rabbitmq');
module.exports = {
    method: 'GET', // Methods Type
    path: '/v1/email', // Url
    config: { // Include this API in swagger documentation
        auth: false,
        tags: ['api'],
        description: 'Home',
        notes: 'Get home page'
    },
    handler(request, reply) {

        const body = {
            to: 'louisdebraine@gmail.com',
            template: 'user_welcome',
            data: {
                username: 'louisdebraine@gmail.com',
                title: 'Title'
            }
        };


        const options = {
            persistent: true,
            deliveryMode: 2, // Non-persistent (1) or persistent (2)
            // priority: 0, // 0 to 9
            contentType: 'application/json'
        };
        RabbitMQ.publish('email', body, options);
        reply({ msg: 'Coucou !' });
    }
};

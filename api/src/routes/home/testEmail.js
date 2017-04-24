import RabbitMQ from '../../../config/rabbitmq';
module.exports = {
    method: 'GET', // Methods Type
    path: '/email', // Url
    config: { // Include this API in swagger documentation
        auth: false,
        tags: ['api'],
        description: 'Home',
        notes: 'Get home page'
    },
    handler: function (request, reply) {

        const body = {
            key:'lol',
            key2:'value',
            key3:'value',
            key4:'value',
            key5:'value'
        };


        const options = {
            persistent: true,
            deliveryMode: 2, // Non-persistent (1) or persistent (2)
            // priority: 0, // 0 to 9
            contentType: 'application/json'
        };
        RabbitMQ.publish('lol', body, options);

        reply({ msg: 'Coucou !'   });

    }
};
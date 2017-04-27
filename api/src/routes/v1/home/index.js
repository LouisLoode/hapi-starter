module.exports = {
    method: 'GET', // Methods Type
    path: '/', // Url
    config: { // Include this API in swagger documentation
        auth: false,
        tags: ['api'],
        description: 'Home',
        notes: 'Get home page'
    },
    handler: function (request, reply) { //Action
      // Response JSON object
        reply({
            statusCode: 200,
            message: 'Welcome home'
        });
    }
};

const Pack = require('../package');

module.exports = {
    register: require('hapi-swagger'),
    options: {
        info: {
            'title': Pack.name,
            'version': Pack.version
        }
    }
}, (err) => {

    if (err) {
        server.log(['error'], 'hapi-swagger load error: ' + err);
    }
    else {
        server.log(['start'], 'hapi-swagger interface loaded');
    }

};

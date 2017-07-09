const Glob = require('glob');
const Path = require('path');

exports.register = function (plugin, options, next) {

    const routes = [];

    // Load routes
    console.log(__dirname);
    Glob.sync('src/plugins/user/routes/**/*.js', {
        root: __dirname,
        ignore: 'src/plugins/user/routes/**/*.spec.js'
    }).forEach((file) => {
        routes.push(require('/api/'+file));
    });

    plugin.route(routes);

    next()
}

exports.register.attributes = {
    name: 'user',
    version: '0.0.1',
    description: 'Hapi user plugin',
    main: 'index.js'
}

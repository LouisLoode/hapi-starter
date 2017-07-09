const Glob = require('glob');
const Path = require('path');

exports.register = function (plugin, options, next) {

    const routes = [];

    // Load routes
    console.log(__dirname);
    Glob.sync('src/plugins/home/routes/**/*.js', {
        root: __dirname,
        ignore: 'src/plugins/home/routes/**/*.spec.js'
    }).forEach((file) => {
        routes.push(require('/api/'+file));
    });

    plugin.route(routes);

    next()
}

exports.register.attributes = {
    name: 'home',
    version: '0.0.1',
    description: 'Hapi home plugin',
    main: 'index.js'
}

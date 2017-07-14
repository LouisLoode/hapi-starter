const Glob = require('glob');

exports.register = function (plugin, options, next) {

    const routes = [];

    // Load routes
    console.log(__dirname);
    Glob.sync('src/plugins/auth/routes/**/*.js', {
        root: __dirname,
        ignore: 'src/plugins/auth/routes/**/*.spec.js'
    }).forEach( ( file ) => {

        routes.push(require('/api/' + file));
    });

    plugin.route(routes);

    return next();
};

exports.register.attributes = {
    name: 'auth',
    version: '0.0.1',
    description: 'Hapi auth plugin',
    main: 'index.js'
};

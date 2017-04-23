import Config from './config';
import Rabbit from 'hapi-rabbit';

module.exports = {
    register: Rabbit,
    options: {
        url: Config.rabbitmq
    }
}, (err) => {

    if (err) {
        console.log(['error'], 'hapi-rabbit load error: ' + err);
    }
    else {
        console.log(['start'], 'hapi-rabbit interface loaded');
    }

};

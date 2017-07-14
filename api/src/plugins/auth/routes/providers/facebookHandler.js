// const AuthHandler = require('../../handlers');
// const FacebookService = require('../../../../../services');
// const Joi = require('joi');
// const Boom = require('boom');
const Wreck = require('wreck');

/**
* OAuth Strategy Overview
*
*   - Check if it's a returning user.
*     - If returning user, sign in and we are done.
*     - Else check if there is an existing account with user's email.
*       - If there is, return an error message.
*       - Else create a new account.
*/

const getUserOnFBHandler = function (request, reply) {

    console.log(request);

    // const options = {
    //     // payload: readableStream || 'foo=bar' || new Buffer('foo=bar'),
    //     headers: { 'content-type': 'application/json' },
    //     timeout: 2500  // 1 second, default: unlimited
    // };

    // const access_token = 'qdsf';
    // const fields = 'id,first_name,last_name,email,birthday,gender,timezone,locale,location';

    // Wreck.get('https://graph.facebook.com/v2.9/me?fields=' + fields + '&access_token=' +access_token, options, (err, res, payload) => {
    //
    //     if (err) {
    //         console.log(err);
    //     }
    //     console.log(response);
    //     return reply(response);
    //     /* do stuff */
    // });

    return reply(request);
};


// const pre3 = function (request, reply) {
//
//     return reply(request.pre.m1 + ' ' + request.pre.m2);
// };

module.exports = {
    method: 'GET',
    path: '/v1/auth/facebook/handler',
    config: {
        // Include this API in swagger documentation
        tags: ['api', 'auth'],
        description: 'Auth an user with his facebook profile.',
        auth: false,
        pre: [
          // m1 and m2 executed in parallel
          { method: getUserOnFBHandler, assign: 'getUserOnFBHandler' }
          // { method: pre2, assign: 'm2' },
          // { method: pre3, assign: 'm3' }
        ]
    },
    handler: getUserOnFBHandler
    // handler(request, reply) {
    //
    //     return reply(request.pre.getUserOnFBHandler + '\n');
    // }
};

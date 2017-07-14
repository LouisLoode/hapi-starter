// const AuthHandler = require('../../handlers');
// const FacebookService = require('../../../../../services');
// const Joi = require('joi');
// const Boom = require('boom');
var request = require('request')
var promise = require('bluebird')
var purest = require('purest')({request, promise})
var config = require('@purest/providers')
var twitter = purest({provider: 'twitter', config})



/**
* OAuth Strategy Overview
*
*   - Check if it's a returning user.
*     - If returning user, sign in and we are done.
*     - Else check if there is an existing account with user's email.
*       - If there is, return an error message.
*       - Else create a new account.
*/

const getUserOnTwitterHandler = function (request, reply) {


    // console.log(request.query["raw[user_id]"]);

    // const access_token = request.query.access_token;
    // const user_id = request.query['raw[user_id]'];

    const params = { user_id: request.query['raw[user_id]'] };

    // twitter.query()
    //     .select('users/show')
    //     .where(params)
    //     .auth(request.query.access_token, request.query.access_secret)
    //     .request(function (err, res, body) {
    //         debugger
    //         if (err) console.log(err)
    //         console.log(body)
            reply(JSON.stringify(request.query, null, 2));
        // })


};


// const pre3 = function (request, reply) {
//
//     return reply(request.pre.m1 + ' ' + request.pre.m2);
// };

module.exports = {
    method: 'GET',
    path: '/v1/auth/twitter/handler',
    config: {
        // Include this API in swagger documentation
        tags: ['api', 'auth'],
        description: 'Auth an user with his twitter profile.',
        auth: false
        // pre: [
          // m1 and m2 executed in parallel
          // { method: getUserOnHandler, assign: 'getUserOnFBHandler' }
          // { method: pre2, assign: 'm2' },
          // { method: pre3, assign: 'm3' }
        // ]
    },
    handler: getUserOnTwitterHandler
    // handler(request, reply) {
    //
    //     return reply(request.pre.getUserOnFBHandler + '\n');
    // }
};

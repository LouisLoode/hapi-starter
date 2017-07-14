// const AuthHandler = require('../../handlers');
// const FacebookService = require('../../../../services/facebookService');
const Request = require('request');
const Boom = require('boom');
const UserModel = require('../../../../models/user');
const AuthUtils = require('../../utils');
const AuthHandlers = require('../../handlers');
const Utils = require('../../../../../config/utils');

/**
* OAuth Strategy Overview
*
*   - Check if it's a returning user.
*     - If returning user, sign in and we are done.
*     - Else check if there is an existing account with user's email.
*       - If there is, return an error message.
*       - Else create a new account.
*/

const getUserOnFBHandler = (request, reply) => {

    const access_token = request.query.access_token;
    const options = { method: 'GET',
        url: 'https://graph.facebook.com/v2.9/me',
        qs: {
            fields: 'id,first_name,last_name,email,birthday,gender,timezone,locale,location',
            access_token
        }
    };
    Request(options, (error, response, body) => {

        if (error) {
            console.log(error);
            return reply(new Error(error));
        }
        if (body === null) {
            return reply(Boom.serverUnavailable('Failed to get data', error));
        }
        const result = JSON.parse(response.body);
        result.access_token = access_token;
        return reply(result);
    });
};

const getLocalUserByFbHandler = (request, reply) => {

    //Fetch all data from mongodb User Collection
    UserModel.findOne({ 'connections.facebook': request.pre.fbUser.id }, (error, data) => {

        // console.log('data begin ---------------------------------------');
        // console.log(data);
        // console.log('data end ---------------------------------------');
        if (error) {
            return reply(Boom.serverUnavailable('Failed to get data', error));
        }
        else {
            if (data === null) {
                return reply(data);
            }
            else {
                return reply({ statusCode: 201, message: 'User Sign in Successfully', data, token: AuthUtils.createJwt(data) }).code(201);
            }
        }
    });
};

const getLocalUserByEmailHandler = (request, reply) => {

    if (request.pre.fbUser.email !== undefined) {
        // Fetch all data from mongodb User Collection
        UserModel.findOne({ 'email': request.pre.fbUser.email }, (error, data) => {

            if (error) {
                return reply(Boom.serverUnavailable('Failed to get data', error));
            }
            else {
                if (data) {
                    return reply(data);
                }
                else {
                    return reply(Boom.notFound('There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.', data));
                }
            }
        });
    } else {
        return reply(null);
    }
};


module.exports = {
    method: 'GET',
    path: '/v1/auth/facebook/handler',
    config: {
        // Include this API in swagger documentation
        tags: ['api', 'auth'],
        description: 'Auth an user with his facebook profile.',
        auth: false
        ,
        pre: [
          // m1 and m2 executed in parallel
          { method: getUserOnFBHandler, assign: 'fbUser' },
          { method: getLocalUserByFbHandler, assign: 'localUser' },
          { method: getLocalUserByEmailHandler, assign: 'localByEmail' }
        ]
    },
    // handler: getUserOnFBHandler
    handler(request, reply) {

        // console.log(request.pre);
        if (request.pre.localByEmail === null && request.pre.localUser === null){
            // console.log(request);
            const access_token = request.pre.fbUser.access_token;
            const fb_id = request.pre.fbUser.id;
            const first_name = request.pre.fbUser.first_name;
            const last_name = request.pre.fbUser.last_name;
            const gender = request.pre.fbUser.gender;

            const password = Utils.randomString(12);
            const user = new UserModel();
            user.email = (request.pre.fbUser.email) ? request.pre.fbUser.email : 'NO-EMAIL@' + Utils.randomString(5) + '.COM';
            user.password = password;
            user.password2 = password;
            user.connections.facebook = fb_id;
            user.connectionsTokens.push({ kind: 'facebook', access_token });
            user.username = `${first_name} ${last_name}`;
            user.infos.gender = gender;
            user.pictures.avatar = `https://graph.facebook.com/${fb_id}/picture?type=large`;
            user.pictures.cover = `https://graph.facebook.com/${fb_id}/picture?type=large`;
            user.infos.location = (request.pre.fbUser.location) ? request.pre.fbUser.location.name : null;
            // console.log(user);
            AuthHandlers.hashPassword(user.password, (err, hash) => {
                if (err) {
                    console.log(err);
                    throw Boom.badRequest(err);
                }
                user.password = hash;
                user.save((err, data) => {

                    if (err) {
                        console.log(err);
                        throw Boom.badRequest(err);
                    }
                    else {
                        // If the user is saved successfully, issue a Jwt
                        return reply({ statusCode: 201, message: 'User Register Successfully', data, token: AuthUtils.createJwt(user) }).code(201);
                    }
                });
            });
        } else {
          // @TODO Useless ?
          // if (request.pre.localUser.statusCode === 201) {
            return reply(request.pre.localUser);
          // }
        }
    }
};

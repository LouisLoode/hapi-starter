// const AuthHandler = require('../../handlers');
// const FacebookService = require('../../../../services/facebookService');
const Request = require('request');
const Boom = require('boom');
const Joi = require('joi');
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
    UserModel.findOne({ 'connections.facebook': request.pre.providerUser.id }, (error, data) => {

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

    if (request.pre.providerUser.email !== undefined) {
        // Fetch all data from mongodb User Collection
        UserModel.findOne({ 'email': request.pre.providerUser.email, 'username': `${request.pre.providerUser.first_name} ${request.pre.providerUser.last_name}`}, (error, data) => {

            if (error) {
                // return reply(Boom.serverUnavailable('Failed to get data', error));
                console.log(error);
                return reply(Boom.notFound('There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.', data));
            }
            else {
                if (data) {
                    return reply(data);
                }
                else {

                    console.log('HEY !');
                    return reply({ statusCode: 201, message: 'User Sign in Successfully', data, token: AuthUtils.createJwt(data) }).code(201);
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
        auth: false,
        validate: {
            query: {
                'access_token': Joi.string().required(),
                'raw[access_token]': Joi.string().required(),
                'raw[token_type]': Joi.string().required(),
                'raw[expires_in]': Joi.string().required()
            }
        },
        pre: [
          // m1 and m2 executed in parallel
          { method: getUserOnFBHandler, assign: 'providerUser' },
          { method: getLocalUserByFbHandler, assign: 'localUser' },
          { method: getLocalUserByEmailHandler, assign: 'localByEmail' }
        ]
    },
    // handler: getUserOnFBHandler
    handler(request, reply) {

        // console.log(request.pre);
        if (request.pre.localByEmail === null && request.pre.localUser === null){
            // console.log(request);
            const access_token = request.pre.providerUser.access_token;
            const fb_id = request.pre.providerUser.id;
            const first_name = request.pre.providerUser.first_name;
            const last_name = request.pre.providerUser.last_name;
            const gender = request.pre.providerUser.gender;
            const password = Utils.randomString(12);
            const user = new UserModel();
            user.email = (request.pre.providerUser.email) ? request.pre.providerUser.email : 'NO-EMAIL@' + Utils.randomString(5) + '.COM';
            user.password = password;
            user.password2 = password;
            user.connections.facebook = fb_id;
            user.connectionsTokens.push({ kind: 'facebook', access_token });
            user.username = `${first_name} ${last_name}`;
            user.infos.gender = gender;
            user.pictures.avatar = `https://graph.facebook.com/${fb_id}/picture?type=large`;
            user.pictures.cover = `https://graph.facebook.com/${fb_id}/picture?type=large`;
            user.infos.location = (request.pre.providerUser.location) ? request.pre.providerUser.location.name : null;
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

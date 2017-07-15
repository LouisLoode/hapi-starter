const Code = require('code');   // assertion library
const Lab = require('lab');
const UserModel = require('../../../models/user');
const Server = require('../../../../server');
const Faker = require('faker');

const lab = exports.lab = Lab.script();

const randomlastName = Faker.name.lastName(); // Rowan
// const randomfirstName = Faker.name.firstName(); // Djoko
const randomEmail = Faker.internet.email(); // Kassandra.Haley@erich.biz

let id_user;
let token_user;

lab.experiment('Register route', () => {

    //Failure case
    lab.test('register an user without username', (done) => {

        const options = {
            method: 'POST',
            url: '/v1/auth/register',
            payload: {
                email: randomEmail,
                password: 'testtest',
                password2: 'testtest'
            }
        };

        Server.inject(options, (response, error) => {
          console.log(error);
          console.log(response);
            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result.error).to.equal('Bad Request');
            Code.expect(response.result.message).to.equal('child "username" fails because ["username" is required]');
            done();

        });

    });

    //Failure case
    lab.test('register an user without email', (done) => {

        const options = {
            method: 'POST',
            url: '/v1/auth/register',
            payload: {
                username: randomlastName,
                password: 'testtest',
                password2: 'testtest'
            }
        };

        Server.inject(options, (response, error) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result.error).to.equal('Bad Request');
            Code.expect(response.result.message).to.equal('child "email" fails because ["email" is required]');
            done();

        });

    });

    //Failure case
    lab.test('register an user without password', (done) => {

        const options = {
            method: 'POST',
            url: '/v1/auth/register',
            payload: {
                username: randomlastName,
                email: randomEmail,
                password2: 'testtest'
            }
        };

        Server.inject(options, (response, error) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result.error).to.equal('Bad Request');
            Code.expect(response.result.message).to.equal('child "password" fails because ["password" is required]');
            done();

        });

    });

    //Failure case
    lab.test('register an user without password2', (done) => {

        const options = {
            method: 'POST',
            url: '/v1/auth/register',
            payload: {
                username: randomlastName,
                email: randomEmail,
                password: 'testtest'
            }
        };

        Server.inject(options, (response, error) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result.error).to.equal('Bad Request');
            Code.expect(response.result.message).to.equal('child "password2" fails because ["password2" is required]');
            done();

        });

    });

    //Failure case
    lab.test('register an user without matching between password and password2', (done) => {

        const options = {
            method: 'POST',
            url: '/v1/auth/register',
            payload: {
                username: randomlastName,
                email: randomEmail,
                password: 'testtest',
                password2: 'testtes'
            }
        };

        Server.inject(options, (response, error) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result.error).to.equal('Bad Request');
            Code.expect(response.result.message).to.equal('passwords are differents');
            done();
        });

    });

    //Success case
    lab.test('register an user with success', (done) => {

        const options = {
            method: 'POST',
            url: '/v1/auth/register',
            payload: {
                username: randomlastName,
                email: randomEmail,
                password: 'testtest',
                password2: 'testtest'
            }
        };

        Server.inject(options, (response, error) => {

            Code.expect(response.statusCode).to.equal(201);
            Code.expect(response.result.data.username).to.equal(randomlastName);
            Code.expect(response.result.data.email).to.equal(randomEmail);
            id_user = response.result.data._id;
            token_user = response.result.token;
            done();

        });

    });

    //Failure case
    lab.test('error if user already exist', (done) => {

        const options = {
            method: 'POST',
            url: '/v1/auth/register',
            payload: {
                username: randomlastName,
                email: randomEmail,
                password: 'testtest',
                password2: 'testtest'
            }
        };


        Server.inject(options, (response, error) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result.error).to.equal('Bad Request');
            Code.expect(response.result.message).to.equal('Username taken');
            done();

        });

    });

    //Success case
    lab.test('check if verif token func is available', (done) => {

        const options = {
            method: 'GET',
            url: '/v1/auth/profile'
        };

        Server.inject(options, (response, error) => {

            Code.expect(response.statusCode).to.equal(401);
            Code.expect(response.result.error).to.equal('Unauthorized');
            Code.expect(response.result.message).to.equal('Missing authentication');

            done();

        });

    });

    //Success case
    lab.test('check if token is valide', (done) => {

        const options = {
            method: 'GET',
            url: '/v1/auth/profile',
            headers: {
                authorization: 'Bearer ' + token_user
            }
        };

        Server.inject(options, (response, error) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.message).to.equal('User Data Successfully Fetched');
            Code.expect(response.result.data.username).to.equal(randomlastName);
            Code.expect(response.result.data.email).to.equal(randomEmail);
            done();

        });

    });

    lab.after((done) => {

        //Fetch all data from mongodb User Collection
        UserModel.findOneAndRemove({ _id: id_user }, (error, data) => {

            if (error) {
                console.log(error);
            }
            done();
        });
    });
});

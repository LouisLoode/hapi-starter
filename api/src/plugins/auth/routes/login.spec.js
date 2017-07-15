const Code = require('code');   // assertion library
const Lab = require('lab');
const UserModel = require('../../../../src/models/user');
const AuthHandler = require('../handlers');

const Server = require('../../../../server');
const Faker = require('faker');

const lab = exports.lab = Lab.script();


const randomlastName = Faker.name.lastName(); // Rowan
// const randomfirstName = Faker.name.firstName(); // Djoko
const randomEmail = Faker.internet.email(); // Kassandra.Haley@erich.biz

let id_user;
let token_user;

lab.experiment('Login route', () => {

    lab.before((done) => {

        const input = {
            username: randomlastName,
            email: randomEmail,
            password: 'testtest',
            password2: 'testtest'
        };

        const user = new UserModel(input); // Call save methods to save data into database
        //Fetch all data from mongodb User Collection

        AuthHandler.hashPassword(input.password, (err, hash) => {

            if (err) {
                console.log(err);
            }
            user.password = hash;
            user.save((err, data) => {

                if (err) {
                    console.log(err);
                }

                // If the user is saved successfully, issue a JWT
                done();

            });
        });
    });

    //Success case
    lab.test('login an user by email with success', (done) => {

        const options = {
            method: 'POST',
            url: '/v1/auth/login',
            payload: {
                email: randomEmail,
                password: 'testtest'
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

    //Success case
    // lab.test('login an user by username with success', (done) => {
    //
    //     const options = {
    //         method: 'POST',
    //         url: '/v1/auth/login',
    //         payload: {
    //             username: randomlastName,
    //             password: 'testtest'
    //         }
    //     };
    //
    //     Server.inject(options, (response, error) => {
    //
    //         Code.expect(response.statusCode).to.equal(201);
    //         Code.expect(response.result.data.username).to.equal(randomlastName);
    //         Code.expect(response.result.data.email).to.equal(randomEmail);
    //         Code.expect(response.result.data._id).to.equal(id_user);
    //         done();
    //
    //     });
    //
    // });

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

    //Failure case
    lab.test('wrong password', (done) => {

        const options = {
            method: 'POST',
            url: '/v1/auth/login',
            payload: {
                email: randomEmail,
                password: 'testtestqdsf'
            }
        };

        Server.inject(options, (response, error) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result.message).to.equal('Incorrect password!');
            Code.expect(response.result.error).to.equal('Bad Request');
            done();

        });

    });

    //Failure case
    lab.test('user doesn\'t exist', (done) => {

        const options = {
            method: 'POST',
            url: '/v1/auth/login',
            payload: {
                email: 'qsdfqsd' + randomEmail,
                password: 'testtest'
            }
        };

        Server.inject(options, (response, error) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result.message).to.equal('Incorrect email!');
            Code.expect(response.result.error).to.equal('Bad Request');
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

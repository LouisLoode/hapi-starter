const Code = require('code');   // assertion library
const Lab = require('lab');
const UserModel = require('../../../../src/models/user');
const AuthHandler = require('../handlers');
const AuthUtils = require('../utils');

const Server = require('../../../../server');
const Faker = require('faker');

const lab = exports.lab = Lab.script();

const sleep = (ms) => {

    return new Promise((resolve) => setTimeout(resolve, ms));
};

const testSleep = () => {

    console.log('Taking a break...');
    sleep(2000);
    console.log('Two second later');
};

const randomlastName = Faker.name.lastName() + 'dsmq'; // Rowan
// const randomfirstName = Faker.name.firstName(); // Djoko
const randomEmail = Faker.internet.email(); // Kassandra.Haley@erich.biz

let id_user;
let token_user;

lab.experiment('GetProfile route', () => {

    lab.before((done) => {

        testSleep();

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

                console.log(data);

                // If the user is saved successfully, issue a JWT
                id_user = data._id;
                token_user = AuthUtils.createJwt(user);
                done();

            });
        });
    });

    //Success case
    lab.test('check if middleware auth is available', (done) => {

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
    // lab.test('check if route don\'t return profile with a wrong token', (done) => {
    //
    //     const options = {
    //         method: 'GET',
    //         url: '/v1/auth/profile',
    //         headers: {
    //             authorization: 'Bearer qdsklmf' + token_user
    //         }
    //     };
    //
    //     Server.inject(options, (response, error) => {
    //
    //         Code.expect(response.statusCode).to.equal(401);
    //         Code.expect(response.result.error).to.equal('Unauthorized');
    //         Code.expect(response.result.message).to.equal('Missing authentication');
    //         done();
    //
    //     });
    //
    // });

    //Success case
    lab.test('check if route can return profile by a token', (done) => {

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

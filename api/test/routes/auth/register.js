'use strict';
require( 'babel-core/register' );

const Code = require('code');   // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Server = require('../../../server');
const faker = require('faker');

var randomlastName = faker.name.lastName(); // Rowan
var randomfirstName = faker.name.firstName(); // Djoko
var randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz

lab.experiment('Register', () => {

  //Success case
  lab.test('should return 200, user profile and token', (done) => {

    const options = {
      method: 'POST',
      url: '/auth/register',
      payload: {
          username: randomlastName,
          email: randomEmail,
          password: 'testtest',
          password2: 'testtest'
      }
    };

    Server.inject(options, (response, error) => {
      console.log(error);
      Code.expect(response.statusCode).to.equal(200);
      // Code.expect(response.body).to.equal(200);
      console.log(response.statusCode);
      console.log(response);
      done();
    });

  });

  // //Failure case
  // lab.test('should return 400', (done) => {
  //
  //   const options = {
  //     method: 'GET',
  //     url: '/qdkjfkm'
  //   };
  //
  //   Server.inject(options, (response) => {
  //     Code.expect(response.statusCode).to.equal(404);
  //     done();
  //   });
  //
  // });

});

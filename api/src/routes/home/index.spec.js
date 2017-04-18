require( 'babel-core/register' );

const Code = require('code');   // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Server = require('../../../server');

lab.experiment('Home route', () => {

    //Success case
    lab.test('should return 200 and good content', (done) => {

        const options = {
            method: 'GET',
            url: '/'
        };

        Server.inject(options, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            done();

        });

    });

    //Failure case
    lab.test('should return 400', (done) => {

        const options = {
            method: 'GET',
            url: '/qdkjfkm'
        };

        Server.inject(options, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            done();

        });

    });
});

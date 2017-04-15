const Code = require('code');   // assertion library
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const server = require('../../bootstrap');

lab.experiment('Articles Models', () => {

  // lab.before((done) => {
  //
  //   // Wait 1 second
  //   setTimeout(() => {
  //
  //       done();
  //   }, 1000);
  // });
  //
  // lab.beforeEach((done) => {
  //
  //   // Run before every single test
  //   done();
  // });

    // tests
    lab.test("main endpoint lists usernames on the network", (done) => {
        let options = {
            method: "GET",
            url: "/"
        };

        server.inject(options, (response) => {
            let result = response.result;
            console.log(result);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});

const Request = require('request');
const Handlebars = require('handlebars');
const Config = require('../../config/config');
const Fs = require('fs');

module.exports = (q) => {
    // Catch all messages
    q.bind('#');

    // Receive messages
    q.subscribe((message) => {

        console.log(message);
        Fs.readFile( __dirname + '/../views/emails/' + message.template + '.html', 'utf8', (err,data) => {
            if (err) {
                return console.log(err);
            }
            const template = Handlebars.compile(data);
            const result = template(message.data);
            const buffer = new Buffer(Config.mailjet.key + ':' + Config.mailjet.secret);
            const authToBase64 = buffer.toString('base64');
            const contentHtml = result;
            const options = { method: 'POST',
                url: 'https://api.mailjet.com/v3/send',
                headers: {
                    'authorization': 'Basic ' + authToBase64,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    'FromEmail':'louisdebraine@gmail.com',
                    'FromName':'Mailjet Pilot',
                    'Subject':'Your email flight plan!',
                    'Text-part': contentHtml,
                    'Html-part': contentHtml,
                    'Recipients':[
                        {
                            'Email': message.to
                        }
                    ]
                })
            };

            Request(options, (error, response, content) => {

                if (error) {
                    throw new Error(error);
                }
                console.log(content);
            });
        });
    });
};

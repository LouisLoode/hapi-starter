const Request = require('request');
const config = require('../../config/config');

module.exports = (q) => {
    // Catch all messages
    q.bind('#');

    // Receive messages
    q.subscribe((message) => {
        console.log(message);
        const buffer = new Buffer(config.mailjet.key + ':' + config.mailjet.secret);
        const authToBase64 = buffer.toString('base64');
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
                'Text-part':'Dear passenger, welcome to Mailjet! May the delivery force be with you!',
                'Html-part':'<h3>Dear passenger, welcome to Mailjet!</h3><br />May the delivery force be with you!',
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
};

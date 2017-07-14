// const Wreck = require('wreck');
//
// const mailjetService = {
//
//     sendEmail(req, res) {
//
//         const password = req.payload.password;
//         // Find an entry from the database that
//         // matches either the email or username
//         UserModel.findOne({
//             $or: [
//                 { email: req.payload.email },
//                 { username: req.payload.username }
//             ]
//         }, (err, user) => {
//
//             if (err){
//                 res(Boom.badRequest(err));
//             }
//             else {
//                 if (user) {
//                     const auth = user.authenticate(password, user.password);
//                     if (!auth) {
//                         res(Boom.badRequest('Incorrect password!'));
//                     }
//                     else {
//                         res(user);
//                     }
//                 }
//                 else {
//                     res(Boom.badRequest('Incorrect username or email!'));
//                 }
//             }
//
//         });
//     },
//
// module.exports = mailjetService;

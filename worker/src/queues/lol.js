module.exports = (q) => {
    // Catch all messages
    q.bind('#');

    // Receive messages
    q.subscribe((message) => {
      // Print messages to stdout
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.log(message);
    });
};

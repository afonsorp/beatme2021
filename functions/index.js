const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const corsWhitelist = ['http://localhost:3000'];
const cors = require('cors')({
  origin(origin, callback) {
    const allow = /.*\.beatme.pt/.test(origin) || corsWhitelist.indexOf(origin) !== -1;
    callback(null, allow);
  },
});

exports.getIp = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    res.set('Cache-Control', 'max-age=3600');
    let addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (/,/.test(addr)) {
      const arr = addr.split(',');
      [addr] = arr;
    }
    const data = {
      data: {
        ip: addr,
      },
    };
    res.json(data);
  });
});

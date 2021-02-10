// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// PROD
const REDIRECT_URL = 'https://beatme.pt/redirect.html';
const COOKIES_OPTIONS = {
  maxAge: 3600000, httpOnly: true, secure: true, sameSite: 'none',
};
//

// DEV
// const REDIRECT_URL = 'http://localhost:3000/redirect.html';
// const COOKIES_OPTIONS = {
//   maxAge: 3600000, httpOnly: true, secure: false,
// };
//

const corsWhitelist = ['http://localhost:3000', 'https://beatme.pt'];

const functions = require('firebase-functions');

const cors = require('cors')({
  origin(origin, callback) {
    const allow = /.*\.beatme.pt/.test(origin) || corsWhitelist.indexOf(origin) !== -1;
    callback(null, { origin: allow, credentials: true });
  },
});
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const admin = require('firebase-admin');
const Async = require('asyncawait/async');
const Await = require('asyncawait/await');
const SpotifyWebApi = require('spotify-web-api-node');
// const { provider } = require('firebase-functions/lib/providers/analytics');
const spotifyAuth = require('./.spotify-auth');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
});

const firebaseDefault = admin.initializeApp(functions.config().firebase, 'other');

// const firestore = admin.firestore();

const firestore = admin.firestore();
const auth = admin.auth();
const database = firebaseDefault.database();

const OAUTH_SCOPES = ['streaming', 'user-read-birthdate', 'user-read-email', 'user-read-private', 'user-read-playback-state', 'user-modify-playback-state'];

const Spotify = new SpotifyWebApi({
  clientId: spotifyAuth.getClientId(),
  clientSecret: spotifyAuth.getClientSecret(),
  redirectUri: REDIRECT_URL,
});

exports.refreshSpotifyToken = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const user = req.query.userId || req.body.data.userId;
    const data = {
      access_token: undefined,
    };
    firestore.collection('servers').doc(user).get().then((doc) => {
      if (doc.exists) {
        const { refreshToken } = doc.data();
        Spotify.setRefreshToken(refreshToken);
        Spotify.refreshAccessToken().then(
          (tokenData) => {
            const { access_token: accessToken } = tokenData.body;
            data.accessToken = accessToken;
            res.json({ data });
          },
        ).catch((err) => {
          console.error({ err });
          res.json({ data });
        });
      } else {
        res.json({ data });
      }
    })
      .catch(() => res.json(data));
  });
});

// exports.getIp = functions.https.onRequest((req, res) => {
//   cors(req, res, () => {
//     res.set('Cache-Control', 'max-age=3600');
//     let addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     if (/,/.test(addr)) {
//       const arr = addr.split(',');
//       [addr] = arr;
//     }
//     const data = {
//       data: {
//         ip: addr,
//       },
//     };
//     res.json(data);
//   });
// });

/**
 * Redirects the User to the Spotify authentication
 * consent screen. Also the 'state' cookie is set for later state
 * verification.
 */
exports.redirect = functions.https.onRequest((req, res) => {
  cookieParser()(req, res, () => {
    const state = req.cookies.state || crypto.randomBytes(20).toString('hex');
    database.ref(`auth/${state}`).set(state).then(() => {
      res.cookie('state', state.toString(), COOKIES_OPTIONS);
      const authorizeURL = Spotify.createAuthorizeURL(OAUTH_SCOPES, state.toString());
      res.redirect(authorizeURL);
    });
  });
});

/**
 * Creates a Firebase account with the given user profile and returns a custom auth token allowing
 * signing-in this account.
 * Also saves the accessToken to the datastore at /spotifyAccessToken/$uid
 *
 * @returns {Promise<string>} The Firebase custom auth token in a promise.
 */
function createFirebaseAccount(
  {
    spotifyUserID: spotifyID,
    userName: displayName,
    profilePic: photoURL,
    email,
    // accessToken,
    refreshToken,
    country,
  },
) {
  // The UID we'll assign to the user.
  const uid = `spotify:${spotifyID}`;
  firestore.collection('servers').doc(email).get().then((doc) => {
    const details = doc.exists
      && doc.data().details
      ? { ...doc.data().details, country }
      : { country };
    const dataToSave = {
      name: displayName,
      email,
      photoURL,
      uid,
      refreshToken,
      details,
    };
    if (doc.exists) {
      firestore.collection('servers').doc(email).update(dataToSave);
      return null;
    }
    firestore.collection('servers').doc(email).set(dataToSave);
    return null;
  })
    .catch((reason) => null);

  // Save the access token to the Firebase Realtime Database.
  // const databaseTask = admin.database().ref(`/spotifyAccessToken/${uid}`).set(accessToken);

  // Create or update the user account.
  const userCreationTask = auth.updateUser(uid, {
    displayName,
    photoURL,
    email,
    emailVerified: true,
  }).catch((error) => {
    // If user does not exists we create it.
    if (error.code === 'auth/user-not-found') {
      return auth.createUser({
        uid,
        displayName,
        photoURL,
        email,
        emailVerified: true,
      });
    }
    throw error;
  });

  // Wait for all async tasks to complete, then generate and return a custom auth token.
  Await([userCreationTask]);
  // Create a Firebase custom auth token.
  const token = Await(auth.createCustomToken(uid));
  // console.log('Created Custom token for UID "', uid, '" Token:', token);
  return token;
}

/**
* Exchanges a given Spotify auth code passed in the 'code' URL query parameter for a Firebase auth token.
* The request also needs to specify a 'state' query parameter which will be checked against the 'state' cookie.
* The Firebase custom auth token is sent back in a JSONP callback function with function name defined by the
* 'callback' query parameter.
*/
exports.token = functions.https.onRequest((req, res) => {
  try {
    cookieParser()(req, res, () => {
      const queryState = req.query.state;
      console.log('Received verification state:', queryState);
      let cookieState = req.cookies.state;
      database.ref(`auth/${queryState}`).once('value', (snapshot) => {
        cookieState = cookieState || snapshot.val();
        console.log('Received state:', cookieState);
        if (!cookieState) {
          console.error('State cookie not set or expired. Maybe you took too long to authorize. Please try again.');
          throw new Error('State cookie not set or expired. Maybe you took too long to authorize. Please try again.');
        } else if (cookieState !== queryState) {
          // console.error('State validation failed');
          throw new Error('State validation failed');
        }
        // console.log('Received auth code:', req.query.code);
        Spotify.authorizationCodeGrant(req.query.code, (error, data) => {
          if (error) {
            throw error;
          }
          // console.log('Received Access Token:', data.body.access_token);
          Spotify.setAccessToken(data.body.access_token);
          Spotify.getMe((Async((getMeError, userResults) => {
            if (getMeError) {
              throw getMeError;
            }
            // console.log('Auth code exchange result received:', userResults);
            // We have a Spotify access token and the user identity now.
            const accessToken = data.body.access_token;
            const spotifyUserID = userResults.body.id;
            const { email } = userResults.body;
            const profilePic = (userResults.body.images[0].url) ? userResults.body.images[0].url
              : 'https://www.w3schools.com/howto/img_avatar.png';
            const userName = (userResults.body.display_name)
              ? userResults.body.display_name
              : email;
            const refreshToken = data.body.refresh_token;
            const { country } = userResults.body;
            // Create a Firebase account and get the Custom Auth Token.
            const firebaseToken = Await(createFirebaseAccount({
              spotifyUserID,
              userName,
              profilePic,
              email,
              accessToken,
              refreshToken,
              country,
            }));
            // Serve an HTML page that signs the user in and updates the user profile.
            res.jsonp({ token: firebaseToken });
          })));
        });
        database.ref(`auth/${queryState}`).remove();
      });
    });
  } catch (error) {
    return res.jsonp({ error: error.toString });
  }
  return null;
});

exports.hourlyWork = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    database.ref('/servers').once('value', (dataSnapshot) => {
      if (dataSnapshot.exists()) {
        const newDate = new Date();
        const DIFFERENCE = 30 * 60 * 1000;
        dataSnapshot.forEach((serverSnap) => {
          const server = serverSnap.val() || { active: false, action: newDate };
          const isTime = (newDate - new Date(server.action)) > DIFFERENCE;
          if (!server.active || isTime) {
            const ip = serverSnap.key;
            serverSnap.ref.remove();
            database.ref(`/playlists/${ip}`).remove();
          }
        });
      }
    }).then(() => res.json({ success: true }))
      .catch((error) => res.status(500).send(error));
  });
});

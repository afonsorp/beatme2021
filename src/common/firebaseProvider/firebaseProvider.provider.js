import React, {
  useMemo, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import Firebase from 'firebase/app';
import FirebaseContext from './firebaseProvider.context';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/functions';

const {
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID,
  REACT_APP_FIREBASE_MEASUREMENT_ID,
} = process.env;

const firebaseConfig = {
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: REACT_APP_FIREBASE_APP_ID,
  measurementId: REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const FirebaseProvider = ({ children }) => {
  const [auth, setAuth] = useState();
  const [firestore, setFirestore] = useState();
  const [database, setDatabase] = useState();
  const [functions, setFunctions] = useState();
  const [googleAuthProvider, setGoogleAuthProvider] = useState();
  const [facebookAuthProvider, setFacebookAuthProvider] = useState();
  const [twitterAuthProvider, setTtwitterAuthProvider] = useState();

  const value = useMemo(
    () => ({
      auth,
      firestore,
      database,
      functions,
      googleAuthProvider,
      facebookAuthProvider,
      twitterAuthProvider,
    }),
    [
      auth,
      firestore,
      database,
      functions,
      googleAuthProvider,
      facebookAuthProvider,
      twitterAuthProvider,
    ],
  );

  useEffect(() => {
    const defaultProject = Firebase.initializeApp(firebaseConfig);
    setAuth(defaultProject.auth());
    setFirestore(defaultProject.firestore());
    setDatabase(defaultProject.database());
    setFunctions(defaultProject.functions());
    setGoogleAuthProvider(new Firebase.auth.GoogleAuthProvider());
    setFacebookAuthProvider(new Firebase.auth.FacebookAuthProvider());
    setTtwitterAuthProvider(new Firebase.auth.TwitterAuthProvider());
  }, []);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

FirebaseProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FirebaseProvider;

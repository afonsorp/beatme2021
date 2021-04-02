import React, {
  useMemo, useState, useEffect, useCallback, useRef,
} from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AuthContext from './authProvider.context';
import { useFirebase } from '../firebaseProvider/firebaseProvider.useFirebase';
import { useSpotify } from '../spotifyProvider/spotifyProvider.useSpotify';
import User, { isAdministrator } from '../models/userModel';
import Playlist from '../../pages/playlist';
import Login from '../../pages/login';
import Settings from '../../pages/settings';
import AdminDetails from '../models/adminDetailsModel';
import { useServer } from '../serverProvider/serverProvider.useServer';
import SearchPage from '../../pages/search';
import LastPlayed from '../../pages/lastPlayed';
import TopDjPage from '../../pages/topDj';
import Favorites from '../../pages/favorites';
import QRCode from '../../pages/qrCode';
import PrivacyPolicy from '../../pages/privacy_policy';

export const BASE_ROUTES = [
  {
    path: '/login',
    label: '',
    component: <Login />,
    showInMenu: false,
  },
  {
    path: '/',
    label: 'menu.home',
    component: <Playlist />,
    showInMenu: true,
  },
  {
    path: '/playlist',
    label: 'menu.home.playlist',
    component: <Playlist />,
    showInMenu: false,
  },
  {
    path: '/privacy_policy',
    label: 'menu.home.privacy',
    component: <PrivacyPolicy />,
    showInMenu: false,
  },

];

const ADMIN_ROUTES = [
  {
    path: '/settings',
    label: 'menu.settings',
    component: <Settings />,
    showInMenu: true,
  },
  {
    path: '/link',
    label: 'menu.link',
    component: <QRCode />,
    showInMenu: true,
  },

];

const USER_ROUTES = [
  {
    path: '/add_music',
    label: 'menu.search',
    component: <SearchPage />,
    showInMenu: true,
  },
  {
    path: '/last',
    label: 'menu.last.played',
    component: <LastPlayed />,
    showInMenu: true,
  },
  {
    path: '/top',
    label: 'menu.top.dj',
    component: <TopDjPage />,
    showInMenu: true,
  },
  {
    path: '/favorites',
    label: 'menu.favorites',
    component: <Favorites />,
    showInMenu: true,
  },
];

export const AuthProvider = ({ children }) => {
  const { t } = useTranslation();
  const { server, playerServer, setServer } = useServer();
  const {
    auth,
    firestore,
    database,
    googleAuthProvider,
    facebookAuthProvider,
    twitterAuthProvider,
  } = useFirebase();
  const { getAndUpdateToken, setSpotifyUser, updateSpotifyUser } = useSpotify();
  const history = useHistory();
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState();
  const [authRoutes, setAuthRoutes] = useState([]);
  const tokenInterval = useRef();

  const updateAdmin = useCallback((configs) => {
    // setLoadingUser(true);
    const nUser = user;
    const nDetails = new AdminDetails({ ...nUser.details, ...configs }).details;
    nUser.details = nDetails;
    firestore.collection('servers').doc(nUser.email).update(nUser);
    if (server) {
      database.ref(`servers/${server}`).update({ ...nUser.details.location });
      database.ref(`playlists/${server}`).update({ songLimit: nUser.details.songLimit });
    }
    toast.dark(t('notify.config.save'));
    history.push('/');
    // setLoadingUser(false);
  }, [user, firestore, database, server, history, t]);

  const logout = useCallback(() => {
    setLoadingUser(true);
    auth.signOut().then(() => {
      setUser();
      setAuthRoutes([]);
      if (user.isAdmin) setServer();
      setLoadingUser(false);
      history.push('/login');
    }).catch(() => {
      setLoadingUser(false);
    });
  }, [auth, history, setServer, user]);

  const setLastSongFromUser = useCallback((song) => {
    const nUser = user;
    nUser.details.lastSongByUser = song;
    setUser(nUser);
    updateSpotifyUser(nUser);
  }, [user, updateSpotifyUser]);

  const buildAuthMenu = useCallback((nUser) => {
    if (!nUser.isAdmin) {
      setAuthRoutes([...BASE_ROUTES, ...USER_ROUTES]);
    } else {
      setAuthRoutes([...BASE_ROUTES, ...ADMIN_ROUTES]);
    }
  }, []);

  const handleSpotifyLogin = useCallback(() => {
    setLoadingUser(true);
    const newWindow = window.open('redirect.html', t('login.spotify'), 'height=585,width=400');
    newWindow.onclose = () => setLoadingUser(false);
  }, [t, setLoadingUser]);

  const handleGoogleLogin = useCallback(() => {
    setLoadingUser(true);
    googleAuthProvider.addScope('email');
    auth.signInWithRedirect(googleAuthProvider);
  }, [auth, googleAuthProvider]);

  const handleFacebookLogin = useCallback(() => {
    setLoadingUser(true);
    facebookAuthProvider.addScope('email');
    auth.signInWithRedirect(facebookAuthProvider);
  }, [auth, facebookAuthProvider]);

  const handleTwitterLogin = useCallback(() => {
    setLoadingUser(true);
    auth.signInWithRedirect(twitterAuthProvider);
  }, [auth, twitterAuthProvider]);

  const value = useMemo(
    () => ({
      loadingUser,
      setLoadingUser,
      user,
      logout,
      authRoutes,
      updateAdmin,
      handleSpotifyLogin,
      handleGoogleLogin,
      handleFacebookLogin,
      handleTwitterLogin,
      setLastSongFromUser,
      setUser,
    }),
    [
      loadingUser,
      setLoadingUser,
      user,
      logout,
      authRoutes,
      updateAdmin,
      handleSpotifyLogin,
      handleGoogleLogin,
      handleFacebookLogin,
      handleTwitterLogin,
      setLastSongFromUser,
      setUser,
    ],
  );

  const authStateChange = useCallback((nUser) => new Promise((resolve) => {
    if (nUser) {
      const isAdmin = isAdministrator(nUser.uid);
      const providerData = nUser.providerData[0];
      const collection = isAdmin ? 'servers' : 'users';
      const id = isAdmin ? nUser.email : providerData.uid;
      firestore.collection(collection).doc(id).get().then((doc) => {
        const details = doc.exists ? doc.data() || {} : {};
        let userModel;
        if (!isAdmin) {
          userModel = new User({ ...nUser, ...providerData, details }).user;
        } else {
          userModel = new User({ ...nUser, ...providerData, ...details }).user;
        }
        buildAuthMenu(userModel);
        setSpotifyUser(userModel);
        resolve(userModel);
      });
    } else {
      resolve(false);
    }
  }), [firestore, buildAuthMenu, setSpotifyUser]);

  useEffect(() => {
    if (!auth) return;
    auth.onAuthStateChanged((nUser) => {
      authStateChange(nUser).then((userModel) => {
        if (!nUser) {
          setUser(false);
          setLoadingUser(false);
        } else if (userModel.isAdmin) {
          getAndUpdateToken(userModel).then((token) => {
            if (token) {
              setUser(() => {
                setLoadingUser(false);
                return userModel;
              });

              if (tokenInterval.current) clearInterval(tokenInterval.current);
              tokenInterval.current = setInterval(() => {
                getAndUpdateToken(userModel).then((r) => {
                  if (r) console.info('Token Refreshed');
                });
              }, 10 * 60 * 1000);
            }
          });
        } else {
          setUser(userModel);
          setLoadingUser(false);
        }
      });
    });
  }, [auth, getAndUpdateToken, authStateChange, server, playerServer]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;

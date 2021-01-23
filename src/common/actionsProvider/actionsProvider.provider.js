import React, {
  useMemo, useCallback, useEffect,
} from 'react';
import PropTypes from 'prop-types';
// import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import ActionsContext from './actionsProvider.context';
import { useAuth } from '../authProvider/authProvider.useAuth';
import { useFirebase } from '../firebaseProvider/firebaseProvider.useFirebase';
import { useServer } from '../serverProvider/serverProvider.useServer';
import { useSpotify } from '../spotifyProvider/spotifyProvider.useSpotify';
import Server from '../models/serverModel';
import PlaylistModel from '../models/playlistsModel';

export const ActionsProvider = ({ children }) => {
  const { t } = useTranslation();
  const {
    database,
    firestore,
    firebaseProject,
  } = useFirebase();
  const { server, getIpRequest } = useServer();
  const {
    startPlaying, play: skip, playing, playlist, songLimitValue,
  } = useSpotify();
  const { user, setUser, setLastSongFromUser } = useAuth();

  const activateServer = useCallback((ip) => {
    const { lat, lng } = user.details.location;
    const info = new Server({
      lat,
      lng,
      active: true,
    }).server;
    database.ref(`servers/${ip}`).update({ ...info });
    database.ref(`playlists/${ip}/action`).once('value', (snapshot) => {
      const actionDate = snapshot.val() ? Date.parse(snapshot.val()) : new Date();
      const date = new Date();
      const hours = Math.abs(date - actionDate) / 36e5;
      if (hours > 1) {
        const pInfo = new PlaylistModel().list;
        database.ref(`playlists/${ip}`).set(pInfo).then(() => startPlaying());
      } else {
        startPlaying();
      }
    });
  }, [database, user, startPlaying]);

  const deactivateServer = useCallback(() => {
    if (!database || !server || !user.isAdmin) return;
    database.ref(`/servers/${server}`).update({
      active: false,
      action: new Date(),
    });
  }, [database, server, user]);

  const registerRadio = useCallback(() => new Promise((resolve) => {
    if (!server) {
      getIpRequest(true).then((ip) => {
        activateServer(ip);
        resolve(ip);
      });
    } else {
      activateServer(server);
      resolve(server);
    }
  }), [activateServer, getIpRequest, server]);

  const addToFavorites = useCallback((element) => {
    const nSong = {
      ...element,
      votes: [],
      owner: {
        uid: user.uid,
        name: user.name,
        photoURL: user.photoURL,
      },
      action: null,
      position: 0,
    };
    const ref = firestore.collection('users').doc(user.uid);
    ref.set({
      favorites: { [element.uri]: nSong },
    }, { merge: true }).then(() => {
      toast.dark(t('notify.music.to.favorites'));
      ref.get().then((f) => {
        const favorites = f.data() ? f.data().favorites : [];
        setUser({
          ...user,
          details: {
            ...user.details,
            favorites,
          },
        });
      });
    });
  }, [user, firestore, setUser, t]);

  const removeFromFavorites = useCallback((element) => {
    const remove = () => {
      const ref = firestore.collection('users').doc(`${user.uid}`);
      ref.get().then((doc) => {
        doc.ref.update({
          [`favorites.${element.uri}`]: firebaseProject.firestore.FieldValue.delete(),
        }).then(() => {
          toast.dark(t('notify.music.removed.favorites'));
          ref.get().then((f) => {
            const favorites = f.data() ? f.data().favorites : [];
            setUser({
              ...user,
              details: {
                ...user.details,
                favorites,
              },
            });
          });
        });
      });
    };
    toast.dark(
      <>
        <span className="toast-text">{t('notify.music.remove.fav')}</span>
        <button className="button toast-button" type="button" onClick={remove}>{t('notify.music.remove.answer')}</button>
      </>,
    );
  }, [user, firestore, firebaseProject, setUser, t]);

  const removeFromPlaylist = useCallback((element) => {
    const remove = () => {
      const ref = database.ref(`playlists/${server}`);
      ref.child(`/playlist/${element.uri}`).remove();
      toast.dark(t('notify.music.removed'));
    };
    toast.dark(
      <>
        <span className="toast-text">{t('notify.music.remove')}</span>
        <button className="button toast-button" type="button" onClick={remove}>{t('notify.music.remove.answer')}</button>
      </>,
    );
  }, [database, server, t]);

  const addVote = useCallback((element) => {
    const ref = database.ref(`playlists/${server}`);
    ref.child(`/playlist/${element.uri}/votes`).once('value', (snapshot) => {
      const val = snapshot.val();
      const value = val ? Object.keys(val) : [];
      const hasVoteAlready = value ? value.includes(user.uid) : undefined;
      if (!hasVoteAlready) {
        ref.child(`/playlist/${element.uri}/votes`)
          .update({ [user.uid]: true }).then(() => ref.child(`topDj/${element.owner.uid}`)
            .transaction((current) => {
              const score = current && current.score ? current.score + 1 : 1;
              const nUser = {
                ...element.owner,
                score,
              };
              return nUser;
            }).catch(() => {
              toast.error(t('notify.music.error'));
            }));
      }
    });
  }, [database, server, user, t]);

  const addSongToPlaylist = useCallback((element) => {
    const isPlaying = playing && playing.uri === element.uri;
    const inPlaylist = !!(playlist
      && playlist.length
      && playlist.find((e) => e.uri === element.uri));
    const myPlaylist = playlist.filter((e) => e.owner.uid === element.owner.uid);
    const insideLimit = myPlaylist ? myPlaylist.length <= parseInt(songLimitValue, 10) : true;
    const song = {
      ...element,
      action: new Date().toISOString(),
    };
    if (!isPlaying && !inPlaylist && insideLimit) {
      database.ref(`playlists/${server}/playlist`).update({ [song.uri]: song }).then(() => {
        firestore.collection('users').doc(user.uid).set({
          lastSongByUser: song.uri,
        }, { merge: true });
        setLastSongFromUser(song.uri);
        toast.dark(t('notify.music.added.playlist'));
      }).catch(() => {
        toast.error(t('notify.music.error'));
      });
    }
    if (isPlaying) {
      toast.warning(t('notify.music.playing'));
    }
    if (inPlaylist) {
      toast.warning(t('notify.music.voted.playlist'));
      addVote(element);
    }
    if (!insideLimit) {
      toast.warning(t('notify.music.song.limit'));
    }
  }, [playing,
    playlist,
    songLimitValue,
    database,
    server,
    t,
    firestore,
    user,
    setLastSongFromUser,
    addVote,
  ]);

  const value = useMemo(
    () => ({
      deactivateServer,
      registerRadio,
      skip,
      addSongToPlaylist,
      addVote,
      addToFavorites,
      removeFromFavorites,
      removeFromPlaylist,
    }),
    [
      deactivateServer,
      registerRadio,
      skip,
      addSongToPlaylist,
      addVote,
      addToFavorites,
      removeFromFavorites,
      removeFromPlaylist,
    ],
  );

  const setupBeforeUnloadListener = useCallback(() => {
    window.addEventListener('beforeunload', (ev) => {
      ev.preventDefault();
      return deactivateServer();
    });
  }, [deactivateServer]);

  useEffect(() => setupBeforeUnloadListener(), [setupBeforeUnloadListener]);

  return (
    <ActionsContext.Provider value={value}>
      {children}
    </ActionsContext.Provider>
  );
};

ActionsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ActionsProvider;

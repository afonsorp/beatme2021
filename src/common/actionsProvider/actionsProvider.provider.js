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
  } = useFirebase();
  const { server, getIpRequest } = useServer();
  const {
    startPlaying, play: skip, playing, playlist, songLimitValue,
  } = useSpotify();
  const { user, setLastSongFromUser } = useAuth();

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
        toast.success(t('notify.music.added.playlist'));
      }).catch(() => {
        toast.error(t('notify.music.error'));
      });
    }
    if (isPlaying) {
      toast.warning(t('notify.music.playing'));
    }
    if (inPlaylist) {
      toast.warning(t('notify.music.voted.playlist'));
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
  ]);

  const addVote = useCallback((element) => {
    database.ref(`playlists/${server}/playlist/${element.uri}/votes`).update({ [user.uid]: true }).catch(() => {
      toast.error(t('notify.music.error'));
    });
  }, [database, server, user, t]);

  const value = useMemo(
    () => ({
      deactivateServer,
      registerRadio,
      skip,
      addSongToPlaylist,
      addVote,
    }),
    [
      deactivateServer,
      registerRadio,
      skip,
      addSongToPlaylist,
      addVote,
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

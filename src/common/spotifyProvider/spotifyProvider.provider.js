import React, {
  useMemo, useState, useCallback, useRef, useEffect,
} from 'react';
import { orderBy } from 'lodash';
import PropTypes from 'prop-types';
import axios from 'axios';
import SpotifyContext from './spotifyProvider.context';
// import { useAuth } from '../authProvider/authProvider.useAuth';
import { useFirebase } from '../firebaseProvider/firebaseProvider.useFirebase';
import SongModel from '../models/songModel';
import { useServer } from '../serverProvider/serverProvider.useServer';
// import { database } from 'firebase-admin';

const SEARCH_URL = 'https://api.spotify.com/v1/search';
// const ARTIST_URL = 'https://api.spotify.com/v1/artists/';
// const ALBUM_URL = 'https://api.spotify.com/v1/albums/';
// const MUSIC_URL = 'https://api.spotify.com/v1/tracks/';
const RECOMMENDATIONS_URL = 'https://api.spotify.com/v1/recommendations';
// const REFRESH_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const PLAY_URL = 'https://api.spotify.com/v1/me/player/play';
// let controller;
// let signal;

export const DEF_SPOTIFY_COUNTRY = 'PT';

export const SpotifyProvider = ({ children }) => {
  const { functions, database } = useFirebase();
  const { server } = useServer();
  const [playlist, setPlaylist] = useState([]);
  const [playing, setPlaying] = useState();
  const [lastPlayed, setLastPlayed] = useState([]);
  const [topDj, setTopDj] = useState();
  const [songLimitValue, setSongLimitValue] = useState(1);
  const [tokenSpotify, setTokenSpotify] = useState();
  const player = useRef();
  const user = useRef();
  const deviceId = useRef();
  const changing = useRef(false);
  const token = useRef();
  const serverRef = useRef(server);
  const spotifyCountry = useRef(DEF_SPOTIFY_COUNTRY);
  const playingRef = useRef(playing);
  const playlistRef = useRef(playlist);
  const positionRef = useRef();
  const axiosRequest = useRef();

  const getAndUpdateToken = useCallback((adminUser) => new Promise((resolve) => {
    if (!adminUser.isAdmin) {
      resolve();
    } else {
      const serverToUse = server || serverRef.current;
      const getSpotifyToken = functions.httpsCallable('refreshSpotifyToken');
      getSpotifyToken({ userId: adminUser.email }).then((result) => {
        const { accessToken } = result.data;
        const { country, songLimit } = adminUser.details;
        token.current = accessToken;
        user.current = adminUser;
        setTokenSpotify(accessToken);
        if (serverToUse) database.ref(`playlists/${serverToUse}`).update({ accessToken, country, songLimit });
        resolve(accessToken);
      }).catch(() => resolve(false));
    }
  }), [functions, database, server]);

  const updateSpotifyUser = useCallback((nUser) => {
    user.current = nUser;
  }, []);

  const setSpotifyUser = useCallback(async (nUser) => {
    const serverToUse = server || serverRef.current;
    if (!serverToUse) return;
    let country = DEF_SPOTIFY_COUNTRY;
    if (nUser.isAdmin) {
      country = nUser.details.country;
      user.current = nUser;
      spotifyCountry.current = country;
    } else {
      database.ref(`playlists/${serverToUse}/country`).once('value', (snapshot) => {
        country = snapshot.val() ? snapshot.val() : DEF_SPOTIFY_COUNTRY;
      });
      database.ref(`playlists/${serverToUse}/accessToken`).on('value', (snapshot) => {
        const spotifyToken = snapshot.val() ? snapshot.val() : undefined;
        token.current = spotifyToken || token.current;
        user.current = nUser;
        spotifyCountry.current = country;
        setTokenSpotify(spotifyToken || token.current);
      });
    }
  }, [database, server]);

  const searchMusic = useCallback((search) => new Promise((resolve) => {
    if (axiosRequest.current) {
      axiosRequest.current.cancel();
    }
    axiosRequest.current = axios.CancelToken.source();
    const { current: country } = spotifyCountry;
    axios.get(`${SEARCH_URL}?limit=30&q=${search}*&type=track&market=${country}`,
      {
        headers:
          {
            Authorization: `Bearer ${token.current}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        cancelToken: axiosRequest.current.token,
      }).then((response) => {
      if (response.data.tracks && response.data.tracks.items) {
        resolve(response.data.tracks.items.map(
          (m) => new SongModel({ ...m, user: user.current }).song,
        ));
      } else {
        resolve([]);
      }
    })
      .catch((error) => {
        console.error({ error });
        resolve([]);
      });
  }), [user]);

  const getRecommend = useCallback((url) => new Promise((resolve) => {
    axios.get(url,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token.current}`,
        },
      })
      .then((response) => {
        if (response && response.data.tracks && response.data.tracks.items) {
          resolve(response.data.tracks.items.map(
            (m) => new SongModel({ ...m, user: user.current }).song,
          ));
        } else if (response && response.data && response.data.tracks) {
          const result = response.data.tracks.length > 1
            ? response.data.tracks.map((s) => new SongModel({ ...s, user: user.current }).song)
            : new SongModel({ ...response.data.tracks[0], user: user.current }).song;
          resolve(result);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        console.error(error);
        resolve(false);
      });
  }), [token, user]);

  const getRandomSearch = useCallback(() => {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
    let randomSearch = '';
    switch (Math.round(Math.random())) {
      case 0:
        randomSearch = `${randomCharacter}`;
        break;
      case 1:
        randomSearch = `*${randomCharacter}`;
        break;
      default:
        break;
    }

    return randomSearch;
  }, []);

  const getUserRecommend = useCallback((userToUse) => new Promise((resolve) => {
    const current = userToUse || user.current;
    const { current: usableToken } = token;
    if (!current || !usableToken) { resolve([]); return; }
    const { lastSongByUser } = current.details;
    let url = '';
    if (lastSongByUser) {
      const seed = `seed_tracks=${lastSongByUser.replace('spotify:track:', '')}`;
      url = `${RECOMMENDATIONS_URL}?limit=5&${seed}&max_duration_ms=300000&market=${spotifyCountry.current}`;
    } else {
      url = `${SEARCH_URL}?limit=5&q=${getRandomSearch()}*&type=track&market=${spotifyCountry.current}`;
    }
    getRecommend(url).then(resolve);
  }), [getRecommend, getRandomSearch, user, token]);

  const getServerRecommend = useCallback(() => new Promise((resolve) => {
    const { current: adminUser } = user;
    if (!adminUser) {
      resolve(false);
      return;
    }
    const { favGenres } = adminUser.details;
    const genre = favGenres[Math.floor(Math.random() * favGenres.length)];
    const seed = playingRef.current ? `seed_tracks=${playingRef.current.uri.replace('spotify:track:', '')}` : `seed_genres=${genre || 'ambient'}`;
    const url = `${RECOMMENDATIONS_URL}?limit=1&${seed}&max_duration_ms=300000&market=${spotifyCountry.current}`;
    getRecommend(url).then(resolve);
  }), [getRecommend, user]);

  const getSongToPlay = useCallback(({ ignorePlaying }) => new Promise((resolve) => {
    const { current: currentPlaying } = playingRef;
    const { current: currentPlaylist } = playlistRef;
    if (!ignorePlaying && currentPlaying) {
      resolve({ song: currentPlaying, remove: false });
    } else if (currentPlaylist.length > 0) {
      resolve({ song: currentPlaylist[0], remove: currentPlaying });
      // getRecommend().then((song) => resolve(song));
    } else {
      getServerRecommend().then((song) => resolve({ song, remove: currentPlaying }));
    }
  }), [getServerRecommend]);

  const play = useCallback(({ ignorePlaying }) => new Promise((resolve) => {
    getSongToPlay({ ignorePlaying }).then(({ song, remove }) => {
      if (song) {
        axios.put(`${PLAY_URL}?device_id=${deviceId.current}`, { uris: [song.uri], position_ms: song.position }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.current}`,
          },
        }).then(() => {
          const ref = database.ref(`playlists/${serverRef.current}`);
          ref.child('playing').update(song).then(() => {
            if (remove) ref.child(`lastPlayed/${remove.uri}`).update({ ...remove, action: new Date().getTime() });
            ref.child(`playlist/${song.uri}`).remove();
            resolve();
          });
          // database.ref(`playlists/${serverRef.current}/playing`)
          // .update(song).then(() => resolve());
        });
      } else {
        console.error('no song to play was found');
        resolve();
      }
    });
  }), [getSongToPlay, token, deviceId, database]);

  const startTimerUpdate = useCallback(() => {
    const { current } = player;
    setInterval(() => {
      if (!current) return;
      current.getCurrentState().then((state) => {
        if (!state) return;
        const { position } = state;
        database.ref(`playlists/${serverRef.current}/playing`).update({ position });
      });
    }, 10000);
  }, [player, database]);

  const startPlaying = useCallback(() => {
    // const token = '[My Spotify Web API access token]';
    const { current } = player;

    if (current) {
      current.connect();
      return;
    }
    const nPlayer = new window.Spotify.Player({
      name: 'Beatme Player',
      getOAuthToken: (cb) => {
        cb(token.current);
        // getAndUpdateToken(adminUser).then((t) => cb(t));
      },
    });
    nPlayer.addListener('initialization_error', ({ message }) => { console.error(message); });
    nPlayer.addListener('authentication_error', ({ message }) => { console.error(message); });
    nPlayer.addListener('account_error', ({ message }) => { console.error(message); });
    nPlayer.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    nPlayer.addListener('player_state_changed', (state) => {
      const { current: isChanging } = changing;
      const { current: position } = positionRef;
      if (state && state.paused && state.position === 0 && !isChanging) {
        changing.current = true;
        play({ ignorePlaying: true }).then(() => {
          database.ref(`playlists/${serverRef.current}`).update({ action: new Date() }).then(() => {
            changing.current = false;
          });
        });
      }
      if (state && !state.paused && state.position !== position && !isChanging) {
        positionRef.current = state.position;
        database.ref(`playlists/${serverRef.current}/playing`).update({ position: state.position });
        database.ref(`servers/${serverRef.current}`).update({ active: true });
      }
    });

    // Ready
    nPlayer.addListener('ready', ({ device_id: device }) => {
      console.log('Ready with Device ID', device);
      deviceId.current = device;
      play({ ignorePlaying: false });
      player.current = nPlayer;
      startTimerUpdate();
    });

    // Not Ready
    nPlayer.addListener('not_ready', ({ device_id: device }) => {
      console.log('Device ID has gone offline', device);
    });

    // Connect to the player!
    nPlayer.connect();
  }, [deviceId, play, database, player, startTimerUpdate]);

  const disconnectPlayer = useCallback(() => {
    const { current } = player;
    if (current) current.disconnect();
  }, [player]);

  useEffect(() => {
    if (server) {
      serverRef.current = server;
      const ref = database.ref(`playlists/${server}`);
      ref.child('playing').on('value', (snapshot) => {
        const value = snapshot.val();
        playingRef.current = value;
        setPlaying(() => value);
      });
      ref.child('playlist').on('value', (snapshot) => {
        const value = snapshot.val();
        const orderedPlaylist = orderBy(value, [(u) => Object.keys(u.votes || []).length, 'action'], ['desc', 'asc']);
        playlistRef.current = orderedPlaylist;
        setPlaylist(() => orderedPlaylist || []);
      });
      ref.child('songLimit').on('value', (snapshot) => {
        const value = snapshot.val();
        setSongLimitValue(value || 1);
      });
      ref.child('lastPlayed').on('value', (snapshot) => {
        const value = snapshot.val();
        const orderedPlayed = orderBy(value, ['action'], ['desc']).slice(0, 10);
        setLastPlayed(orderedPlayed);
      });
      ref.child('topDj').on('value', (snapshot) => {
        const value = snapshot.val();
        const orderedTop = orderBy(value, ['score'], ['desc']);
        setTopDj(orderedTop);
      });
    }
  }, [server, database, playingRef]);

  const value = useMemo(
    () => ({
      getAndUpdateToken,
      startPlaying,
      play,
      playing,
      playlist,
      disconnectPlayer,
      searchMusic,
      setSpotifyUser,
      songLimitValue,
      updateSpotifyUser,
      lastPlayed,
      topDj,
      getUserRecommend,
      tokenSpotify,
    }),
    [
      getAndUpdateToken,
      startPlaying,
      play,
      playing,
      playlist,
      disconnectPlayer,
      searchMusic,
      setSpotifyUser,
      songLimitValue,
      updateSpotifyUser,
      lastPlayed,
      topDj,
      getUserRecommend,
      tokenSpotify,
    ],
  );

  return (
    <SpotifyContext.Provider value={value}>
      {children}
    </SpotifyContext.Provider>
  );
};

SpotifyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SpotifyProvider;

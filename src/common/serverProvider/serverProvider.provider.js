/* eslint-disable no-plusplus */
/* eslint-disable no-mixed-operators */
import React, {
  useMemo, useState, useEffect, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ServerContext from './serverProvider.context';
import { useFirebase } from '../firebaseProvider/firebaseProvider.useFirebase';

const LOCAL_STORAGE_KEY = 'server_info';
const SERVER_KEY_IDENTIFIER = 'key';

const isValidServer = (server) => server && server.length > 7;

export const ServerProvider = ({ children }) => {
  const { functions, database } = useFirebase();
  const location = useLocation();
  const [server, setServer] = useState();
  const [playerServer, setplayerServer] = useState();
  const [isActive, setIsActive] = useState();
  const [serverLoading, setServerLoading] = useState(true);

  const checkActive = useCallback((key) => new Promise((resolve) => {
    database.ref(`/servers/${key}`).once('value').then((snapshot) => {
      const values = snapshot.val() ? snapshot.val() : { active: false };
      if (values && (values.active === 'true' || values.active)) {
        resolve(key);
      } else {
        resolve(false);
      }
    });
  }), [database]);

  const setInStorage = useCallback((ip) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, ip);
  }, []);

  const watchActive = useCallback((ip) => {
    if (!ip || !database) return;
    database.ref(`/servers/${ip}/active`).on('value', (snapshot) => {
      const active = snapshot.val();
      setIsActive(active);
    });
  }, [database]);

  const setServerKey = useCallback((ip) => {
    const resolveIp = isValidServer(ip) ? ip : false;
    setServerLoading(false);
    setInStorage(resolveIp);
    setServer(resolveIp);
    watchActive(resolveIp);
  }, [setInStorage, watchActive]);

  const getIpFromHeroku = useCallback((ignoreActive = false) => new Promise((resolve) => {
    axios.get('https://beatme-get-ip.herokuapp.com/ip').then((result) => {
      const { ip, isIPv6 } = result.data;
      if (ip) {
        const nIp = ip.replaceAll('.', '');
        setplayerServer(nIp);
        if (ignoreActive) {
          setServerKey(nIp);
          resolve(nIp);
          return;
        }
        if (isIPv6) {
          resolve(false);
        } else {
          checkActive(nIp).then((active) => resolve(active));
        }
      } else {
        resolve(false);
      }
    });
  }), [checkActive, setServerKey]);

  // const getIpRequest = useCallback((ignoreActive = false) => new Promise((resolve) => {
  //   const getIp = functions.httpsCallable('getIp');
  //   getIp().then((result) => {
  //     const { ip } = result.data;
  //     if (ip) {
  //       const nIp = ip.replaceAll('.', '');
  //       setplayerServer(nIp);
  //       if (ignoreActive) {
  //         // setServer(nIp);
  //         resolve(nIp);
  //         setServerKey(nIp);
  //       } else {
  //         checkActive(nIp).then((active) => resolve(active));
  //       }
  //     } else {
  //       resolve(false);
  //     }
  //   }).catch(() => resolve(false));
  // }), [checkActive, functions, setServerKey]);

  const value = useMemo(
    () => ({
      server,
      serverLoading,
      setServerLoading,
      getIpRequest: getIpFromHeroku,
      playerServer,
      isActive,
      setServer,
    }),
    [
      server,
      serverLoading,
      setServerLoading,
      getIpFromHeroku,
      playerServer,
      isActive,
      setServer,
    ],
  );

  const getFromUrl = useCallback(() => new Promise((resolve) => {
    const params = new Map(location.search.slice(1).split('&').map((kv) => kv.split('=')));
    const hasKey = params.has(SERVER_KEY_IDENTIFIER);
    if (hasKey) {
      const key = params.get(SERVER_KEY_IDENTIFIER);
      checkActive(key).then((active) => resolve(active));
    } else {
      resolve(false);
    }
  }), [location, checkActive]);

  // const getFromStorage = useCallback(() => {
  //   const serverInfo = localStorage.getItem(LOCAL_STORAGE_KEY);
  //   return new Promise((resolve) => {
  //     if (serverInfo) {
  //       checkActive(serverInfo).then((active) => resolve(active));
  //     } else {
  //       resolve(false);
  //     }
  //   });
  // }, [checkActive]);

  const getServerList = useCallback(() => new Promise((resolve) => {
    database.ref('/servers').once('value', (serversList) => {
      let servers = [];
      serversList.forEach((snapshot) => {
        const obj = snapshot.val();
        const { key } = snapshot;
        if (obj && obj.active && obj.lat && obj.lng) {
          const s = [key, obj.lat, obj.lng];
          servers.push(s);
        }
      });
      servers = (servers.length > 0) ? servers : false;
      resolve(servers);
    });
  }), [database]);

  const getByGeo = useCallback(() => new Promise((resolve) => {
    // Get User's Coordinate from their Browser
    getServerList().then((beatmeList) => {
      const Failed = (error) => {
        console.error({ error });
        resolve(false);
      };
      const distance = (lat1, lon1, lat2, lon2) => {
        const p = 0.017453292519943295; // Math.PI / 180
        const c = Math.cos;
        const a = 0.5 - c((lat2 - lat1) * p) / 2
            + c(lat1 * p) * c(lat2 * p)
            * (1 - c((lon2 - lon1) * p)) / 2;
        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
      };

      const NearestBeatme = (latitude, longitude) => {
        let mindif = 20;
        let closest;
        let secondClosest;
        for (let index = 0; index < beatmeList.length; ++index) {
          const dif = distance(latitude, longitude, beatmeList[index][1], beatmeList[index][2]);
          if (dif <= 0.50 && dif < mindif) {
            closest = index;
            mindif = dif;
          } else if (dif > 0.50 && dif < 10 && dif < mindif) {
            secondClosest = index;
            mindif = dif;
          }
        }
        // auth.setGeoActive(true);
        const closestIp = beatmeList[closest] ? beatmeList[closest][0] : false;
        const secondClosestIp = beatmeList[secondClosest] ? beatmeList[secondClosest][0] : false;
        const result = {
          closest: closestIp || false,
          secondClosest: secondClosestIp || false,
        };
        resolve(result);
      };

      const UserLocation = (position) => {
        NearestBeatme(position.coords.latitude, position.coords.longitude);
      };

      if (navigator.geolocation) {
        const options = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000,
        };
        navigator.geolocation.getCurrentPosition(UserLocation, Failed, options);
      } else {
        resolve(false);
      }
    });
    // Callback function for asynchronous call to HTML5 geolocation
  }), [getServerList]);

  useEffect(() => {
    if (!serverLoading || !functions || !location || !database || server) return;
    setServerLoading(true);
    getFromUrl().then((resUrl) => {
      if (resUrl) {
        setServerKey(resUrl);
      } else {
        getIpFromHeroku().then((resRequest) => {
          if (resRequest) {
            setServerKey(resRequest);
          } else {
            getByGeo().then((resGeo) => {
              const { closest, secondClosest } = resGeo;
              setServerKey(closest || secondClosest);
            });
          }
        });
      }
    });
  }, [functions,
    getFromUrl,
    location,
    database,
    getByGeo,
    // getFromStorage,
    // getIpRequest,
    setServerKey,
    serverLoading,
    getIpFromHeroku,
    server,
  ]);

  return (
    <ServerContext.Provider value={value}>
      {children}
    </ServerContext.Provider>
  );
};

ServerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ServerProvider;

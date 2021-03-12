import React, { useState, useEffect, useRef } from 'react';
import { useServer } from '../serverProvider/serverProvider.useServer';
import { useSpotify } from '../spotifyProvider/spotifyProvider.useSpotify';

const getMinutesRight = (minutes) => `${(minutes < 10 ? '0' : '') + minutes}`;

const getClockFromMillis = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  const time = seconds === '60'
    ? `${getMinutesRight(minutes * 1 + 1)}:00`
    : `${getMinutesRight(minutes)}:${seconds < 10 ? '0' : ''}${seconds}`;
  return time;
};

export const SongTimer = () => {
  const { server, isActive } = useServer();
  const { playing } = useSpotify();
  const [currentTime, setCurrentTime] = useState({
    time: '00:00',
    total: '00:00',

  });
  const positionRef = useRef(0);
  const positionToUse = useRef(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (!server || !playing || !isActive) return;
      const { position, duration } = playing;
      if (position === positionRef.current) {
        positionToUse.current += 1000;
      } else {
        positionRef.current = position;
        positionToUse.current = position;
      }
      const time = getClockFromMillis(positionToUse.current);
      const total = getClockFromMillis(duration);
      setCurrentTime(() => ({ time, total }));
    }, 1000);
    return () => clearInterval(interval);
  }, [server, playing, isActive]);

  return (<>{`${currentTime.time}/${currentTime.total}`}</>);
};

export default SongTimer;

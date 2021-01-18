import React, { useEffect, useState, useRef } from 'react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useServer } from '../common/serverProvider/serverProvider.useServer';
import { useSpotify } from '../common/spotifyProvider/spotifyProvider.useSpotify';
import BlankCd from '../images/blank_cd.jpeg';

// const getClockFromMillis = (millis) => {
//   const minutes = Math.floor(millis / 60000);
//   const seconds = ((millis % 60000) / 1000).toFixed(0);
//   const time = seconds === '60'
//     ? `${minutes}${1}:00`
//     : `${(minutes < 10 ? '0' : '') + minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   return time;
// };

const CircularAlbumContainer = () => {
  const { server, isActive } = useServer();
  const { playing } = useSpotify();
  const [percentage, setPercentage] = useState(0);
  // const [currentTime, setCurrentTime] = useState('00:00');
  const positionRef = useRef(0);
  const positionToUse = useRef(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (!server || !playing || !isActive) return;
      const { duration, position } = playing;
      if (position === positionRef.current) {
        positionToUse.current += 1000;
      } else {
        positionRef.current = position;
        positionToUse.current = position;
      }
      // const time = getClockFromMillis(positionToUse.current);
      // eslint-disable-next-line no-mixed-operators
      const completed = (positionToUse.current * 100 / duration);
      setPercentage(() => completed);
      // setCurrentTime(() => time);
    }, 1000);
    return () => clearInterval(interval);
  }, [server, playing, isActive]);

  return (
    <CircularProgressbarWithChildren value={percentage} className="m-circularAlbum">
      <img
        style={{ width: 40, marginTop: -5 }}
        src={playing && playing.album ? playing.album.backImage.url : BlankCd}
        alt="cover"
        className="m-song-exposer__image"
      />
      {/* <h4 className="m-song-exposer__time">{currentTime}</h4> */}
    </CircularProgressbarWithChildren>

  );
};

export default CircularAlbumContainer;

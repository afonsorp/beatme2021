import React from 'react';
import Spotify from '../../images/spotify.png';
// import './poweredBy.scss';

const PoweredBy = () => (
  <div className="m-powered-by">
    <span>powered by</span>
    <img src={Spotify} alt="Powered by Spotify" className="a-powered-by__image" />
  </div>
);

export default PoweredBy;

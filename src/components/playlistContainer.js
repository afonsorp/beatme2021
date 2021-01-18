import React from 'react';
import SwipeableListComp, { LIST_TYPES } from './swipeableList';
import './playlistContainer.scss';
import { useSpotify } from '../common/spotifyProvider/spotifyProvider.useSpotify';

const PlaylistContainer = () => {
  const { playlist } = useSpotify();
  return (
    <div className="m-playlist__container">
      <div className="m-playlist__container__list">
        <SwipeableListComp result={playlist} type={LIST_TYPES.PLAYLIST} />
      </div>
    </div>
  );
};

export default PlaylistContainer;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSpotify } from '../common/spotifyProvider/spotifyProvider.useSpotify';
import { Waves } from './svgWaveContainer';
import SwipeableListComp, { LIST_TYPES } from './swipeableList';

const LastSong = () => {
  const { t } = useTranslation();
  const { lastPlayed } = useSpotify();
  return (
    <div className="m-list__container">
      <div className="m-list__containerTitle">
        <span>{t('menu.last.played')}</span>
      </div>
      <div className="m-list__containerWaves">
        <Waves />
      </div>
      <div className="m-playlist__container m-playlist__containerList">
        <div className="m-playlist__container__list">
          <SwipeableListComp result={lastPlayed} type={LIST_TYPES.LAST_PLAYED} />
        </div>
      </div>
    </div>

  );
};

export default LastSong;

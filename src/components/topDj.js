import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSpotify } from '../common/spotifyProvider/spotifyProvider.useSpotify';
import { Waves } from './svgWaveContainer';
import SwipeableListComp, { LIST_TYPES } from './swipeableList';

const TopDj = () => {
  const { t } = useTranslation();
  const { topDj } = useSpotify();
  return (
    <div className="m-list__container">
      <div className="m-list__containerTitle">
        <span>{t('menu.top.dj')}</span>
      </div>
      <Waves />
      <div className="m-playlist__container m-playlist__containerList">
        <div className="m-playlist__container__list">
          <SwipeableListComp result={topDj} type={LIST_TYPES.TOP_DJ} />
        </div>
      </div>
    </div>

  );
};

export default TopDj;

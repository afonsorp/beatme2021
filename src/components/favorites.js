import React from 'react';
import { useTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import { useAuth } from '../common/authProvider/authProvider.useAuth';
import { Waves } from './svgWaveContainer';
import SwipeableListComp, { LIST_TYPES } from './swipeableList';

const ARTICLE = 'the ';

const FavoritesComponent = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { favorites } = user.details;
  const orderedVavorites = orderBy(favorites, (item) => item.artist.name.toLowerCase().replace(ARTICLE, ''), ['asc']);
  const data = orderedVavorites.reduce((r, e) => {
    const group = e.artist.name.toLowerCase().replace(ARTICLE, '')[0];
    // eslint-disable-next-line no-param-reassign
    if (!r[group]) r[group] = { group, children: [e] };
    else r[group].children.push(e);
    return r;
  }, {});

  return (
    <div className="m-list__container">
      <div className="m-list__containerTitle">
        <span>{t('menu.favorites')}</span>
      </div>
      <Waves />
      <div className="m-playlist__container m-playlist__containerList">
        <div className="m-playlist__container__list">
          <SwipeableListComp result={Object.values(data)} type={LIST_TYPES.FAVORITES} />
        </div>
      </div>
    </div>
  );
};

export default FavoritesComponent;

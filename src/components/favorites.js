import React from 'react';
import { useTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import { useAuth } from '../common/authProvider/authProvider.useAuth';
import { Waves } from './svgWaveContainer';
import SwipeableListComp, { LIST_TYPES } from './swipeableList';

const FavoritesComponent = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { favorites } = user.details;
  const orderedVavorites = orderBy(favorites, ['artist.name'], ['asc']);
  const data = orderedVavorites.reduce((r, e) => {
    // get first letter of name of current element
    const group = e.artist.name[0];
    // if there is no property in accumulator with this letter create it
    // eslint-disable-next-line no-param-reassign
    if (!r[group]) r[group] = { group, children: [e] };
    // if there is push current element to children array for that letter
    else r[group].children.push(e);
    // return accumulator
    return r;
  }, {});

  return (
    <div className="m-list__container">
      <div className="m-list__containerTitle">
        <span>{t('menu.favorites')}</span>
      </div>
      <div className="m-list__containerWaves">
        <Waves />
      </div>
      <div className="m-playlist__container m-playlist__containerList">
        <div className="m-playlist__container__list">
          <SwipeableListComp result={Object.values(data)} type={LIST_TYPES.FAVORITES} />
        </div>
      </div>
    </div>
  );
};

export default FavoritesComponent;

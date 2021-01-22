/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { RiStarLine, RiStarFill, RiDeleteBin2Line } from 'react-icons/ri';
import { SwipeableList } from '@sandstreamdev/react-swipeable-list';
import { useTranslation } from 'react-i18next';
import { useActions } from '../common/actionsProvider/actionsProvider.useActions';
import { useAuth } from '../common/authProvider/authProvider.useAuth';
import SwipeableSearchListComp from './swipeableListSearchElement';
import SwipeablePlayListItemComp from './swipeableListPlaylistElement';
import SwipeableListPlayedElement from './swipeableListPlayedElement';

import '@sandstreamdev/react-swipeable-list/dist/styles.css';
import './swipeableList.scss';

export const LIST_TYPES = {
  SEARCH: 'search',
  PLAYLIST: 'playlist',
  FAVORITES: 'favorites',
  TOP_DJ: 'top',
  LAST_PLAYED: 'last_played',
};

const SwipeableListComp = ({
  result, type,
}) => {
  const { addSongToPlaylist, addVote } = useActions();
  const { user } = useAuth();
  const { t } = useTranslation();
  const isMine = useCallback((element) => element.owner.uid === user.uid, [user]);
  const isFavorite = useCallback((element) => (user.details.favorites
    ? user.details.favorites.includes(element.uri)
    : false), [user]);

  const FavSwipe = memo(({ isFav }) => (
    <span className="m-swipeable-item -left -yellow">
      {!isFav ? <RiStarLine className="m-swipeable-item__icon" /> : <RiStarFill className="m-swipeable-item__icon" />}
      <span className="m-swipeable-item__text">{!isFav ? t('expandable.icon.favorites') : t('expandable.icon.remove.favorites')}</span>
    </span>
  ));
  FavSwipe.propTypes = {
    isFav: PropTypes.bool.isRequired,
  };

  const RemSwipe = memo(() => (
    <span className="m-swipeable-item -right -red">
      <span className="m-swipeable-item__text">{t('expandable.icon.delete')}</span>
      <RiDeleteBin2Line className="m-swipeable-item__icon" />
    </span>
  ));

  const getSwipeableComponent = useCallback(() => {
    switch (type) {
      case LIST_TYPES.PLAYLIST:
        return result.map((element) => (
          <SwipeablePlayListItemComp
            element={element}
            key={element.uri}
            addVote={addVote}
            user={user}
            id={element.uri}
            SwipeRight={() => <FavSwipe isFav={isFavorite(element)} />}
            RemSwipe={() => <RemSwipe />}
            isMine={isMine(element)}
          />
        ));
      case LIST_TYPES.SEARCH:
        return result.map((element) => (
          <SwipeableSearchListComp
            element={element}
            key={element.uri}
            addAction={addSongToPlaylist}
            id={element.uri}
            SwipeRight={() => <FavSwipe isFav={isFavorite(element)} />}
          />
        ));
      case LIST_TYPES.LAST_PLAYED:
        return result.map((element) => (
          <SwipeableListPlayedElement
            element={element}
            key={element.uri}
            id={element.uri}
            SwipeRight={() => <FavSwipe isFav={isFavorite(element)} />}
          />
        ));
      default:
        return null;
    }
  }, [addSongToPlaylist, result, type, addVote, user, isFavorite, isMine]);

  return (
    <SwipeableList>
      { getSwipeableComponent() }
    </SwipeableList>
  );
};

SwipeableListComp.propTypes = {
  result: PropTypes.arrayOf(PropTypes.shape({})),
  type: PropTypes.oneOf([LIST_TYPES.SEARCH,
    LIST_TYPES.TOP_DJ,
    LIST_TYPES.PLAYLIST,
    LIST_TYPES.FAVORITES]),
};

SwipeableListComp.defaultProps = {
  result: [],
  type: LIST_TYPES.PLAYLIST,
};

export default SwipeableListComp;

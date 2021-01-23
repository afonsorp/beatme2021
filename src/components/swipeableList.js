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
import SwipeableListTopDjElement from './swipeableListTopDjElement';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';
import './swipeableList.scss';
import SwipeableListFavoritesElement from './swipeableListFavoritesElement';

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
  const {
    addSongToPlaylist, addVote, addToFavorites, removeFromFavorites, removeFromPlaylist,
  } = useActions();
  const { user } = useAuth();
  const { t } = useTranslation();
  const isMine = useCallback((element) => element.owner.uid === user.uid, [user]);
  const isFavorite = useCallback((element) => (user.details.favorites
    ? Object.keys(user.details.favorites).includes(element.uri)
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

  const getSwipeableComponent = useCallback((rest) => {
    switch (type) {
      case LIST_TYPES.PLAYLIST:
        return result.map((element) => {
          const isInFavorite = isFavorite(element);
          return (
            <SwipeablePlayListItemComp
              element={element}
              key={element.uri}
              addVote={addVote}
              user={user}
              id={element.uri}
              SwipeRight={() => <FavSwipe isFav={isInFavorite} />}
              addToFavorites={isInFavorite ? removeFromFavorites : addToFavorites}
              RemSwipe={() => <RemSwipe />}
              removeFromPlaylist={removeFromPlaylist}
              isMine={isMine(element)}
              {...rest}
            />
          );
        });
      case LIST_TYPES.SEARCH:
        return result.map((element) => {
          const isInFavorite = isFavorite(element);

          return (
            <SwipeableSearchListComp
              element={element}
              key={element.uri}
              addAction={addSongToPlaylist}
              id={element.uri}
              SwipeRight={() => <FavSwipe isFav={isInFavorite} />}
              addToFavorites={isInFavorite ? removeFromFavorites : addToFavorites}
              {...rest}
            />
          );
        });
      case LIST_TYPES.LAST_PLAYED:
        return result.map((element) => {
          const isInFavorite = isFavorite(element);
          return (
            <SwipeableListPlayedElement
              element={element}
              key={element.uri}
              id={element.uri}
              SwipeRight={() => <FavSwipe isFav={isFavorite(element)} />}
              addToFavorites={isInFavorite ? removeFromFavorites : addToFavorites}
              {...rest}
            />
          );
        });
      case LIST_TYPES.TOP_DJ:
        return result.map((element, index) => (
          <SwipeableListTopDjElement
            element={element}
            key={element.uid}
            id={element.uid}
            position={index + 1}
            {...rest}
          />
        ));
      case LIST_TYPES.FAVORITES:
        return result.map((element) => (
          <div key={element.group}>
            <div className="m-swipeable-item__group"><strong>{element.group}</strong></div>
            {element.children.map((song) => {
              const isInFavorite = isFavorite(song);
              return (
                <SwipeableListFavoritesElement
                  element={song}
                  key={song.uri}
                  id={song.uri}
                  SwipeRight={() => <FavSwipe isFav={isFavorite(song)} />}
                  addToFavorites={isInFavorite ? removeFromFavorites : addToFavorites}
                  addAction={addSongToPlaylist}
                  {...rest}
                />
              );
            })}
          </div>
        ));
      default:
        return null;
    }
  }, [addSongToPlaylist,
    result,
    type,
    addVote,
    user,
    isFavorite,
    isMine,
    removeFromFavorites,
    addToFavorites,
    removeFromPlaylist]);

  return (
    <SwipeableList>
      {({ className, ...rest }) => (
        getSwipeableComponent(rest)
      )}
    </SwipeableList>
  );
};

SwipeableListComp.propTypes = {
  result: PropTypes.arrayOf(PropTypes.shape({})),
  type: PropTypes.oneOf(Object.keys(LIST_TYPES).map((t) => LIST_TYPES[t])),
};

SwipeableListComp.defaultProps = {
  result: [],
  type: LIST_TYPES.PLAYLIST,
};

export default SwipeableListComp;

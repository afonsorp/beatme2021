/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { SwipeableList } from '@sandstreamdev/react-swipeable-list';
import { useActions } from '../common/actionsProvider/actionsProvider.useActions';
import { useAuth } from '../common/authProvider/authProvider.useAuth';
import SwipeableSearchListComp from './swipeableListSearchElement';
import SwipeablePlayListItemComp from './swipeableListPlaylisElement';

import '@sandstreamdev/react-swipeable-list/dist/styles.css';
import './swipeableList.scss';

export const LIST_TYPES = {
  SEARCH: 'search',
  PLAYLIST: 'playlist',
  FAVORITES: 'favorites',
  TOP_DJ: 'top',
};

const SwipeableListComp = ({
  result, type,
}) => {
  const { addSongToPlaylist, addVote } = useActions();
  const { user } = useAuth();
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
          />
        ));
      case LIST_TYPES.SEARCH:
        return result.map((element) => (
          <SwipeableSearchListComp
            element={element}
            key={element.uri}
            addAction={addSongToPlaylist}
            id={element.uri}
          />
        ));
      default:
        return result.map((element) => (
          <SwipeablePlayListItemComp
            element={element}
            key={element.uri}
            addAction={addSongToPlaylist}
            id={element.uri}
          />
        ));
    }
  }, [addSongToPlaylist, result, type, addVote, user]);

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

import React from 'react';
import PropTypes from 'prop-types';
import { SwipeableListItem } from '@sandstreamdev/react-swipeable-list';

const SwipeableListPlayedElement = ({ element, SwipeRight }) => (
  <SwipeableListItem
    swipeRight={{
      content: <SwipeRight />,
      action: () => () => {},
    }}
  >
    <div className="m-swipeable-item__container__song">
      <div className="m-swipeable-item__infoContainer">
        <img src={element.album.avatarImage.url} alt="Avatar" className="avatar" />
        <div className="m-swipeable-item__info">
          <span className="a-swipeable-item__name">
            {element.artist.name}
          </span>
          <span className="a-swipeable-item__song">{element.name}</span>
        </div>
      </div>
    </div>
  </SwipeableListItem>
);

SwipeableListPlayedElement.propTypes = {
  element: PropTypes.shape({
    artist: PropTypes.shape({
      name: PropTypes.string,
    }),
    album: PropTypes.shape({
      avatarImage: PropTypes.shape({
        url: PropTypes.string,
      }),
    }),
    name: PropTypes.string,
  }).isRequired,
  SwipeRight: PropTypes.elementType.isRequired,
};

export default SwipeableListPlayedElement;

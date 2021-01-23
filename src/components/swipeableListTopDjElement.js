import React from 'react';
import PropTypes from 'prop-types';
import { SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
import { RiHeartFill } from 'react-icons/ri';

const SwipeableListTopDjElement = ({ element, position }) => (
  <SwipeableListItem>
    <div className="m-swipeable-item__container__song">
      <div className="m-swipeable-item__infoContainer">
        <img src={element.photoURL} alt="Avatar" className="avatar" />
        <div className="m-swipeable-item__info">
          <span className="a-swipeable-item__name a-swipeable-item__score">
            {`#${position < 10 ? `0${position}` : position}`}
            <RiHeartFill className="m-swipeable-item__icon" />
            <span className="a-swipeable-item__voteBadge">{element.score}</span>
          </span>
          <span className="a-swipeable-item__song">{element.name}</span>
        </div>
      </div>
    </div>
  </SwipeableListItem>
);

SwipeableListTopDjElement.propTypes = {
  element: PropTypes.shape({
    name: PropTypes.string,
    photoURL: PropTypes.string,
    score: PropTypes.number,
  }).isRequired,
  position: PropTypes.number.isRequired,
};

export default SwipeableListTopDjElement;

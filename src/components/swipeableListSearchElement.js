import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
import { RiAddCircleLine, RiStarSLine } from 'react-icons/ri';
import { Trans } from 'react-i18next';

const SwipeableListSearchElement = ({ element, addAction }) => {
  const SwipeRight = memo(() => (
    <>
      <RiStarSLine className="m-swipeable-item__favorite" />
      <Trans>expandable.icon.favorites</Trans>
    </>
  ));

  const SwipeLeft = memo(() => (
    <>
      <Trans>menu.search</Trans>
      <RiAddCircleLine className="m-swipeable-item__addSong" />
    </>
  ));

  return (
    <SwipeableListItem
      swipeLeft={{
        content: <SwipeLeft />,
        action: () => addAction(element),
      }}
      swipeRight={{
        content: <SwipeRight />,
        action: () => addAction(element),
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
          <RiAddCircleLine className="m-swipeable-item__addSong" onClick={() => addAction(element)} />
        </div>
      </div>
    </SwipeableListItem>
  );
};

SwipeableListSearchElement.propTypes = {
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
  addAction: PropTypes.func.isRequired,
};

export default SwipeableListSearchElement;

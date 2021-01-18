import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
import { RiHeartLine, RiHeartFill, RiStarSLine } from 'react-icons/ri';
import { Trans } from 'react-i18next';

const SwipeableListPlaylistElement = ({ element, addVote, user }) => {
  const votes = element.votes ? Object.keys(element.votes) : [];
  const nVotes = votes.length;
  const iVoted = votes.includes(user.uid);

  console.log({ nVotes, iVoted });

  const SwipeRight = memo(() => (
    <>
      <RiStarSLine className="m-swipeable-item__favorite" />
      <Trans>expandable.icon.favorites</Trans>
    </>
  ));

  const SwipeLeft = memo(() => (
    <>
      <Trans>menu.search</Trans>
      <RiHeartLine className="m-swipeable-item__addSong" />
    </>
  ));

  return (
    <SwipeableListItem
      swipeLeft={{
        content: <SwipeLeft />,
        action: () => addVote(element),
      }}
      swipeRight={{
        content: <SwipeRight />,
        action: () => addVote(element),
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
          { iVoted ? <RiHeartFill className="m-swipeable-item__like" />
            : <RiHeartLine className="m-swipeable-item__like" onClick={() => addVote(element)} />}
          {nVotes > 0 && <span className="a-swipeable-item__voteBadge">{nVotes}</span>}
        </div>
      </div>
    </SwipeableListItem>
  );
};

SwipeableListPlaylistElement.propTypes = {
  element: PropTypes.shape({
    votes: PropTypes.shape({}),
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
  addVote: PropTypes.func.isRequired,
  user: PropTypes.shape({
    uid: PropTypes.string,
  }).isRequired,
};

export default SwipeableListPlaylistElement;

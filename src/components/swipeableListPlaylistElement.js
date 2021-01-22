import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
import { RiHeartLine, RiHeartFill, RiDeleteBin2Line } from 'react-icons/ri';

const SwipeableListPlaylistElement = ({
  element, addVote, user, SwipeRight, RemSwipe, isMine,
}) => {
  const votes = element.votes ? Object.keys(element.votes) : [];
  const nVotes = votes.length;
  const iVoted = votes.includes(user.uid);
  const VoteComp = memo(() => (
    <>
      { iVoted ? <RiHeartFill className="m-swipeable-item__icon" />
        : <RiHeartLine className="m-swipeable-item__icon" onClick={() => addVote(element)} />}
      {nVotes > 0 && <span className="a-swipeable-item__voteBadge">{nVotes}</span>}
    </>
  ));

  const DeleteComp = memo(() => (
    <>
      <RiDeleteBin2Line className="m-swipeable-item__icon" onClick={() => addVote(element)} />
    </>
  ));

  return (
    <SwipeableListItem
      swipeLeft={isMine ? {
        content: <RemSwipe />,
        action: () => addVote(element),
      } : undefined}
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
          {!user.isAdmin ? <VoteComp /> : <DeleteComp />}
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
    isAdmin: PropTypes.bool,
  }).isRequired,
  SwipeRight: PropTypes.elementType.isRequired,
  RemSwipe: PropTypes.elementType.isRequired,
  isMine: PropTypes.bool.isRequired,
};

export default SwipeableListPlaylistElement;

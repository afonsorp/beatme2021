import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
import { RiHeartLine, RiHeartFill, RiDeleteBin2Line } from 'react-icons/ri';

const SwipeableListPlaylistElement = ({
  element, addVote, user, SwipeRight, RemSwipe, isMine, addToFavorites, removeFromPlaylist,
}) => {
  const votes = element.votes ? Object.keys(element.votes) : [];
  const nVotes = votes.length;
  const iVoted = votes.includes(user.uid);
  const VoteComp = memo(() => (
    <>
      {nVotes > 0 && <span className="a-swipeable-item__voteBadge">{nVotes}</span>}
      { iVoted ? <RiHeartFill className="m-swipeable-item__icon" />
        : <RiHeartLine className="m-swipeable-item__icon" onClick={() => addVote(element)} />}
    </>
  ));

  const DeleteComp = memo(() => (
    <>
      <RiDeleteBin2Line className="m-swipeable-item__icon" onClick={() => removeFromPlaylist(element)} />
    </>
  ));

  return (
    <SwipeableListItem
      swipeLeft={isMine ? {
        content: <RemSwipe />,
        action: () => removeFromPlaylist(element),
      } : undefined}
      swipeRight={!user.isAdmin ? {
        content: <SwipeRight />,
        action: () => addToFavorites(element),
      } : undefined}
    >
      <div className="m-swipeable-item__container__song">
        <div className="m-swipeable-item__infoContainer">
          <img src={element.owner.photoURL} alt="Avatar" className="avatar" />
          <div className="m-swipeable-item__info">
            <span className="a-swipeable-item__name">
              {element.owner.name}
            </span>
            <span className="a-swipeable-item__song">{`${element.artist.name} - ${element.name}`}</span>
          </div>
          {!user.isAdmin ? <VoteComp /> : <DeleteComp />}
        </div>
      </div>
    </SwipeableListItem>
  );
};

SwipeableListPlaylistElement.propTypes = {
  element: PropTypes.shape({
    owner: PropTypes.shape({
      name: PropTypes.string,
      photoURL: PropTypes.string,
    }),
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
    photoURL: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  SwipeRight: PropTypes.elementType.isRequired,
  RemSwipe: PropTypes.elementType.isRequired,
  isMine: PropTypes.bool.isRequired,
  addToFavorites: PropTypes.func.isRequired,
  removeFromPlaylist: PropTypes.func.isRequired,
};

export default SwipeableListPlaylistElement;

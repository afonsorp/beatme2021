import React, { useCallback, useState } from 'react';
import './playlistContainer.scss';
import classnames from 'classnames';
import { RiPlayCircleLine, RiSkipForwardLine, RiPlayListAddLine } from 'react-icons/ri';
import { useTranslation } from 'react-i18next/';
import { useHistory } from 'react-router-dom';
import { Waves } from './svgWaveContainer';
import { useSpotify } from '../common/spotifyProvider/spotifyProvider.useSpotify';
import { useActions } from '../common/actionsProvider/actionsProvider.useActions';
import { useAuth } from '../common/authProvider/authProvider.useAuth';
import { useServer } from '../common/serverProvider/serverProvider.useServer';
import SwipeableListComp, { LIST_TYPES } from './swipeableList';

const PlaylistContainer = () => {
  const history = useHistory();

  const { t } = useTranslation();
  const { user } = useAuth();
  const { server, isActive } = useServer();
  const { playlist } = useSpotify();
  const [disabled, setDisabled] = useState(false);
  const { registerRadio, skip } = useActions();

  const start = useCallback(() => {
    setDisabled(true);
    registerRadio();
  }, [registerRadio]);

  const skipSong = useCallback(() => {
    setDisabled(true);
    skip({ ignorePlaying: true }).then(() => setDisabled(false));
  }, [skip]);

  const add = useCallback(() => {
    history.push('/add_music');
  }, [history]);

  const getButton = useCallback(() => {
    if (user.isAdmin && server && isActive) {
      return (
        <button type="button" className={classnames('button play-button', { '-disabled': disabled })} onClick={skipSong} disabled={disabled}>
          <RiSkipForwardLine className="icon" />
          {t('server.skip.label')}
        </button>
      );
    }
    if (user.isAdmin && (!server || (server && !isActive))) {
      return (
        <button type="button" className={classnames('button play-button', { '-disabled': disabled })} onClick={start} disabled={disabled}>
          <RiPlayCircleLine className="icon" />
          {t('server.start.label')}
        </button>
      );
    }
    return (
      <button type="button" className={classnames('button play-button', { '-disabled': disabled })} onClick={add} disabled={disabled}>
        <RiPlayListAddLine className="icon" />
        {t('menu.search')}
      </button>
    );
  }, [server, user.isAdmin, t, disabled, start, isActive, skipSong, add]);

  return (
    <div className="m-playlist__container -home">
      <Waves />
      <div className="m-playlist__container__list">
        {getButton()}

        <SwipeableListComp result={playlist} type={LIST_TYPES.PLAYLIST} />
      </div>
    </div>
  );
};

export default PlaylistContainer;

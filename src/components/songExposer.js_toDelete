import React, { useCallback, useState } from 'react';
import classnames from 'classnames';
import { RiPlayCircleLine, RiSkipForwardLine, RiPlayListAddLine } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import CircularAlbumContainer from './circularAlbumContainer';
import './songExposer.scss';
import { useAuth } from '../common/authProvider/authProvider.useAuth';
import { useServer } from '../common/serverProvider/serverProvider.useServer';
import { useActions } from '../common/actionsProvider/actionsProvider.useActions';
import { useSpotify } from '../common/spotifyProvider/spotifyProvider.useSpotify';
import { Waves } from './svgWaveContainer';

const SongExposer = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { user } = useAuth();
  const { server, isActive } = useServer();
  const { registerRadio, skip } = useActions();
  const { playing } = useSpotify();
  const [disabled, setDisabled] = useState(false);
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
    <>
      <div className="m-song-exposer customHeight">
        <CircularAlbumContainer />
      </div>
      <div className="m-song-exposer__songInfo">
        <Waves />
        <div className="m-song-exposer__container__song">
          <div className="m-song-exposer__infoContainer">
            <div className="m-song-exposer__info">
              {playing && playing.owner && (
              <>
                <span className="a-song-exposer__name">{playing ? playing.owner.name : 'N/A'}</span>
                <span className="a-song-exposer__song">
                  {playing ? playing.name : 'N/A'}
                  <span className="a-song-exposer__band">{playing ? ` - ${playing.artist.name}` : 'N/A'}</span>
                </span>
              </>
              )}
            </div>
          </div>
        </div>
        {getButton()}
      </div>
    </>
  );
};

export default SongExposer;

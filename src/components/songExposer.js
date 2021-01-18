/* eslint-disable max-len */
import React, { useCallback, useState } from 'react';
import classnames from 'classnames';
import { RiPlayCircleLine, RiSkipForwardLine, RiPlayListAddLine } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
// import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import CircularAlbumContainer from './circularAlbumContainer';
// import Pablo from '../images/pablo_aimar.jpg';
import './songExposer.scss';
import { useAuth } from '../common/authProvider/authProvider.useAuth';
import { useServer } from '../common/serverProvider/serverProvider.useServer';
import { useActions } from '../common/actionsProvider/actionsProvider.useActions';
import { useSpotify } from '../common/spotifyProvider/spotifyProvider.useSpotify';

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
        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="m-song-exposer__svg">
          <path fill="#f08f8f" fillOpacity="1" d="M0,128L40,133.3C80,139,160,149,240,133.3C320,117,400,75,480,85.3C560,96,640,160,720,176C800,192,880,160,960,176C1040,192,1120,256,1200,261.3C1280,267,1360,213,1400,186.7L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z" />
        </svg> */}

        <svg className="m-song-exposer__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#F4B0B1"
            d="M0,128L40,133.3C80,139,160,149,240,133.3C320,117,400,75,480,85.3C560,96,640,160,720,176C800,192,880,160,960,176C1040,192,1120,256,1200,261.3C1280,267,1360,213,1400,186.7L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          />
        </svg>

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

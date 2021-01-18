import React from 'react';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { useActions } from '../common/actionsProvider/actionsProvider.useActions';
import { useAuth } from '../common/authProvider/authProvider.useAuth';
import { useSpotify } from '../common/spotifyProvider/spotifyProvider.useSpotify';
import ActionsMenu from './actionsMenu';

import './topMenu.scss';

const TopMenu = () => {
  const { logout } = useAuth();
  const { disconnectPlayer } = useSpotify();
  const { deactivateServer } = useActions();
  return (
    <header className="m-beatme-header">
      <menu type="context" className="m-beatme-header__menu">
        <span className="a-beatme-header__item">
          <RiLogoutCircleLine
            className="icon a-beatme-header__icon"
            onClick={() => {
              disconnectPlayer();
              deactivateServer();
              logout();
            }}
          />
        </span>
        <span className="a-beatme-header__item" />
        <span className="a-beatme-header__item --last">
          <ActionsMenu />
        </span>
      </menu>
    </header>
  );
};

export default TopMenu;

import React, { useCallback } from 'react';
import { RiMenuFoldLine } from 'react-icons/ri';
import {
  Menu,
  MenuItem,
  MenuButton,
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';

import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../common/authProvider/authProvider.useAuth';
import { useSpotify } from '../common/spotifyProvider/spotifyProvider.useSpotify';
import { useActions } from '../common/actionsProvider/actionsProvider.useActions';

const ActionsMenu = () => {
  const { t } = useTranslation();
  const { user: { photoURL, name, isAdmin }, authRoutes, logout } = useAuth();
  const { disconnectPlayer } = useSpotify();
  const { deactivateServer } = useActions();
  const menuElements = authRoutes.filter((obj) => obj.showInMenu);

  const onLogout = useCallback(() => {
    if (isAdmin) {
      disconnectPlayer();
      deactivateServer();
    }
    logout();
  }, [disconnectPlayer, deactivateServer, logout, isAdmin]);

  return (
    <Menu
      menuButton={<MenuButton className="a-beatme-header__menuButton"><RiMenuFoldLine className="icon a-beatme-header__icon" /></MenuButton>}
      direction="left"
      position="anchor"
      align="start"
      arrow
      className="m-beatme-header__menuActions"
    >
      <MenuItem className="m-beatme-header__menuItem">
        <NavLink to="/" className="a-beatme-header__menuItem" activeClassName="selected" exact>
          <img src={photoURL} alt={name} className="avatar" />
          {name}
        </NavLink>
      </MenuItem>
      {menuElements.map((element) => (
        <MenuItem key={element.path}>
          <NavLink to={element.path} className="a-beatme-header__menuItem" activeClassName="selected" exact>
            {t(element.label)}
          </NavLink>
        </MenuItem>
      ))}

      <MenuItem>
        <div
          className="a-beatme-header__menuItem"
          onClick={onLogout}
          onKeyDown={onLogout}
          role="button"
          tabIndex={0}
        >
          {t('menu.logout')}
        </div>
      </MenuItem>
    </Menu>
  );
};

export default ActionsMenu;

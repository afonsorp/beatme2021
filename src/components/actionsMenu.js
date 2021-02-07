import React from 'react';
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

const ActionsMenu = () => {
  const { t } = useTranslation();
  const { user: { photoURL, name }, authRoutes } = useAuth();
  const menuElements = authRoutes.filter((obj) => obj.showInMenu);
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
    </Menu>
  );
};

export default ActionsMenu;

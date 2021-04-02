import React from 'react';
import ActionsMenu from './actionsMenu';

// import './topMenu.scss';

const TopMenu = () => (
  <header className="m-beatme-header">
    <menu type="context" className="m-beatme-header__menu">
      {/* <span className="a-beatme-header__item --last"> */}
      <ActionsMenu />
      {/* </span> */}
    </menu>
  </header>
);

export default TopMenu;

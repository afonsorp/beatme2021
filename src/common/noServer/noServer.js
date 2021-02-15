import React from 'react';
import { BrowserView } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import {
  BiCommentError,
} from 'react-icons/bi';
import { useAuth } from '../authProvider/authProvider.useAuth';
import PoweredBy from '../poweredBy/poweredBy';
import './noServer.scss';

const NoServer = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  return (
    <div className="o-noServer">
      <BiCommentError className="icon icon-full-page" />
      <p className="a-noServer-text">{t('no.session.message')}</p>
      { user && (
      <BrowserView>
        <button className="button" type="button" onClick={logout}>
          <img src={user.photoURL} alt={user.name} className="avatar" />
          {t('menu.logout')}
        </button>
      </BrowserView>
      )}
      <PoweredBy />
    </div>
  );
};

export default NoServer;

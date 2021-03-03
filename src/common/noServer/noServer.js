import React from 'react';
import { BrowserView } from 'react-device-detect';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  BiCommentError,
} from 'react-icons/bi';
import { useAuth } from '../authProvider/authProvider.useAuth';
import PoweredBy from '../poweredBy/poweredBy';
import './noServer.scss';

const NoServer = ({ notSupportedMessage }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  return (
    <div>
      <div className="o-noServer">
        <BiCommentError className="icon icon-full-page" />
        <p className="a-noServer-text">{t('no.session.message')}</p>
        <BrowserView>
          { user && (
          <button className="button" type="button" onClick={logout}>
            <img src={user.photoURL} alt={user.name} className="avatar" />
            {t('menu.logout')}
          </button>
          )}
          { notSupportedMessage && (
          <p className="a-noServer-text a-noServer-supportedText">
            <i>{t('no.session.message.not.supported')}</i>
          </p>
          )}
        </BrowserView>
        <PoweredBy />
      </div>
    </div>
  );
};

NoServer.propTypes = {
  notSupportedMessage: PropTypes.bool,
};

NoServer.defaultProps = {
  notSupportedMessage: false,
};

export default NoServer;

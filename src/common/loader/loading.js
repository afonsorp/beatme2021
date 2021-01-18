import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../authProvider/authProvider.useAuth';
import { useServer } from '../serverProvider/serverProvider.useServer';
import loadImage from '../../images/loader.gif';
import PoweredBy from '../poweredBy/poweredBy';

import './loading.scss';

const LoadingComponent = () => {
  const { loadingUser } = useAuth();
  const { serverLoading } = useServer();
  const { t } = useTranslation();
  return (
    <div className={classNames('o-loading', 'global-container', { '-visible': loadingUser || serverLoading })}>
      <img src={loadImage} alt="loading" className="a-loading__image" />
      <p className="a-loading__text">{t('loading.text')}</p>
      <PoweredBy />
    </div>
  );
};

export default LoadingComponent;

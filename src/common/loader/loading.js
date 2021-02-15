import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import {
  ImSpinner10,
} from 'react-icons/im';
import { useAuth } from '../authProvider/authProvider.useAuth';
import { useServer } from '../serverProvider/serverProvider.useServer';
import PoweredBy from '../poweredBy/poweredBy';

import './loading.scss';

const LoadingComponent = () => {
  const { loadingUser } = useAuth();
  const { serverLoading } = useServer();
  const { t } = useTranslation();
  return (
    <div className={classNames('o-loading', 'global-container', { '-visible': loadingUser || serverLoading })}>
      <ImSpinner10 className="icon icon-spin icon-full-page" />
      <p className="a-loading__text">{t('loading.text')}</p>
      <PoweredBy />
    </div>
  );
};

export default LoadingComponent;

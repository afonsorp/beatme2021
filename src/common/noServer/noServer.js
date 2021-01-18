import React from 'react';
import { useTranslation } from 'react-i18next';
import loadImage from '../../images/question-bubble-outline.gif';
import PoweredBy from '../poweredBy/poweredBy';

import './noServer.scss';

const NoServer = () => {
  const { t } = useTranslation();
  return (
    <div className="o-noServer">
      <img src={loadImage} alt="No Server" className="a-noServer__image" />
      <p className="a-noServer-text">{t('no.session.message')}</p>
      <PoweredBy />
    </div>
  );
};

export default NoServer;

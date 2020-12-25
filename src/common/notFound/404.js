import React from 'react';
import { useTranslation } from 'react-i18next';
import loadImage from '../../images/tool-outline.gif';

import './404.scss';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="o-notFound">
      <img src={loadImage} alt="404" className="a-notFound__image" />
      <p className="a-notFound-text">{t('not.found.text')}</p>
    </div>
  );
};

export default NotFound;

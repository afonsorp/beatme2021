import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BiCommentX,
} from 'react-icons/bi';
import './404.scss';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="o-notFound">
      <BiCommentX className="icon icon-full-page" />
      <p className="a-notFound-text">{t('not.found.text')}</p>
    </div>
  );
};

export default NotFound;

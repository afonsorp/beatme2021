import React from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode.react';
import { useServer } from '../common/serverProvider/serverProvider.useServer';
import { Waves } from './svgWaveContainer';
import './qrcode.scss';

const QRCodeComponent = () => {
  const { t } = useTranslation();
  const { server } = useServer();
  return (
    <div className="m-list__container">
      <div className="m-list__containerTitle">
        <span>{t('menu.link')}</span>
      </div>
      <Waves />
      <div className="m-playlist__container m-playlist__containerList">
        <div className="m-playlist__container__list m-playlist__container__listCode">
          <p className="a-list__inspiration">{t('direct.link.details')}</p>

          <QRCode value={`beatme.pt/?key=${server}`} size={300} />
        </div>
      </div>
    </div>

  );
};

export default QRCodeComponent;

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../common/authProvider/authProvider.useAuth';
import MapConfig from '../common/maps/map';
import './config.scss';

const GENRES = [
  'acoustic',
  'alternative',
  'ambient',
  'blues',
  'dance',
  'electronic',
  'hip-hop',
  'indie',
  'pop',
  'rock',
];

const Configs = () => {
  const {
    register, handleSubmit, errors, setValue,
  } = useForm();
  const { t } = useTranslation();

  const { user, updateAdmin } = useAuth();
  const { location: userLocation } = user.details;
  const [location, setLocation] = useState(userLocation);

  useEffect(() => {
    setValue('lat', location.lat, { shouldDirty: true });
    setValue('lng', location.lng, { shouldDirty: true });
  }, [location, setValue]);

  const onSubmit = (data) => {
    const nData = {
      ...data,
      location: {
        lat: data.lat,
        lng: data.lng,
      },
      needsConfiguration: false,
    };
    updateAdmin(nData);
  };
  return (
    <div className="global-container">
      <h2 className="a-config-username">{user.name}</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate="novalidate" className="m-config-form">
        <fieldset className="m-config-fieldSet">
          <legend>
            {t('MaxSong')}
          </legend>
          <label htmlFor="songLimit" className="inp">
            <input name="songLimit" defaultValue={user.details.songLimit || 3} type="number" min={1} max={10} ref={register({ min: 1, max: 10, required: true })} />
            {errors.songLimit && <span className="m-config-form__errorField">{t('MaxSongError')}</span>}
          </label>
        </fieldset>
        <fieldset className="m-config-fieldSet -genres">
          <legend>{t('CheckBox')}</legend>
          {GENRES.map((g) => (
            <label htmlFor="favGenres" key={g} className="-label-input">
              <input type="checkbox" name="favGenres" value={g} ref={register()} defaultChecked={user.details.favGenres.includes(g)} />
              {g}
            </label>
          ))}
        </fieldset>
        <fieldset className="m-config-fieldSet">
          <legend>
            {t('location')}
          </legend>
          <label htmlFor="lat">
            <input name="lat" ref={register()} readOnly defaultValue={location.lat} className="-readonly" />
          </label>
          <label htmlFor="lng">
            <input name="lng" ref={register()} readOnly defaultValue={location.lng} className="-readonly" />
          </label>
          <MapConfig location={location} setLocation={setLocation} />
        </fieldset>

        <input type="submit" className="button a-config-form__button" value={t('config.submit')} />

      </form>
    </div>
  );
};

export default Configs;

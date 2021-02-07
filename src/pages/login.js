import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  RiSpotifyLine, RiTwitterLine, RiGoogleLine, RiFacebookLine,
} from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import LogoLarge from '../images/logoLarge.png';
import PoweredBy from '../common/poweredBy/poweredBy';
import { useAuth } from '../common/authProvider/authProvider.useAuth';

import './login.scss';

const Login = ({ isPlayer }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const {
    handleSpotifyLogin,
    user,
    handleGoogleLogin,
    handleFacebookLogin,
    handleTwitterLogin,
  } = useAuth();

  useEffect(() => {
    if (user) {
      history.push('/');
    }
  }, [history, user]);

  return (
    <>
      <div className="m-login-top__container">
        <div className="wave -one" />
        <div className="wave -two" />
        <div className="wave -three" />
        <div className="image">
          <img src={LogoLarge} alt="Logo" />
        </div>
      </div>

      <div className="m-login-bottom__container global-container">

        {isPlayer ? (
          <button className="button" type="button" onClick={handleSpotifyLogin}>
            <RiSpotifyLine className="icon spotify-icon" />
            {t('login.spotify')}
          </button>
        )
          : (
            <>
              <button className="button" type="button" onClick={handleFacebookLogin}>
                <RiFacebookLine className="icon facebook-icon" />
                {t('login.facebook')}
              </button>
              <button className="button" type="button" onClick={handleGoogleLogin}>
                <RiGoogleLine className="icon google-icon" />
                {t('login.google')}
              </button>
              <button className="button" type="button" onClick={handleTwitterLogin}>
                <RiTwitterLine className="icon twitter-icon" />
                {t('login.twitter')}
              </button>
            </>
          )}
        <PoweredBy />
      </div>

    </>
  );
};

Login.propTypes = {
  isPlayer: PropTypes.bool,
};

Login.defaultProps = {
  isPlayer: false,
};

export default Login;

import React, {
  useCallback, useRef, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSpotify } from '../common/spotifyProvider/spotifyProvider.useSpotify';
import { useAuth } from '../common/authProvider/authProvider.useAuth';

const SearchForm = ({ setResult, setIsSuggestion, isSuggestion }) => {
  const {
    searchMusic, getUserRecommend, tokenSpotify,
  } = useSpotify();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [favs, setFavs] = useState();
  const musicRef = useRef();
  const { register } = useForm({
    mode: 'onChange',
    formState: 'isValid',
  });

  const handleSuggestion = useCallback(() => {
    if (user.uid && tokenSpotify) {
      setIsSuggestion(true);
      getUserRecommend(user).then((favorites) => {
        setResult(favorites);
        setFavs(favorites);
      });
    }
  }, [user, tokenSpotify, getUserRecommend, setIsSuggestion, setResult]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const { value } = e.target;
    if (value.length > 1) {
      setIsSuggestion(false);
      searchMusic(value).then(setResult);
    } else if (!isSuggestion) {
      handleSuggestion();
    }
    // console.log({ value });
  }, [searchMusic, setResult, setIsSuggestion, isSuggestion, handleSuggestion]);

  const registerRef = useCallback((e) => {
    register(e);
    musicRef.current = e;
  }, [register]);

  useEffect(() => {
    if (musicRef.current) {
      register(musicRef.current);
      musicRef.current.focus();
    }
  }, [register]);

  useEffect(() => {
    if (!favs) handleSuggestion();
  }, [handleSuggestion, favs]);

  return (
    <form onChange={handleSubmit} onSubmit={handleSubmit}>
      <input name="music" ref={registerRef} className="a-searchForm__input" placeholder={t('search.form.input')} />
    </form>
  );
};

SearchForm.propTypes = {
  setResult: PropTypes.func,
  setIsSuggestion: PropTypes.func,
  isSuggestion: PropTypes.bool,
};

SearchForm.defaultProps = {
  setResult: () => {},
  setIsSuggestion: () => {},
  isSuggestion: false,
};

export default SearchForm;

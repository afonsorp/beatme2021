import React, { useCallback, useRef, useEffect } from 'react';
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
  const musicRef = useRef();
  const { register } = useForm({
    mode: 'onChange',
    formState: 'isValid',
  });

  const handleSuggestion = useCallback(() => {
    if (user && tokenSpotify) {
      setIsSuggestion(true);
      getUserRecommend(user).then(setResult);
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
    handleSuggestion();
  }, [handleSuggestion]);

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

import React, { useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSpotify } from '../common/spotifyProvider/spotifyProvider.useSpotify';

const SearchForm = ({ setResult }) => {
  const { searchMusic } = useSpotify();
  const { t } = useTranslation();
  const musicRef = useRef();
  const { register } = useForm({
    mode: 'onChange',
    formState: 'isValid',
  });
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const { value } = e.target;
    if (value.length > 1) {
      searchMusic(value).then(setResult);
    } else {
      setResult([]);
    }
    // console.log({ value });
  }, [searchMusic, setResult]);

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

  return (
    <form onChange={handleSubmit} onSubmit={handleSubmit}>
      <input name="music" ref={registerRef} className="a-searchForm__input" placeholder={t('search.form.input')} />
    </form>
  );
};

SearchForm.propTypes = {
  setResult: PropTypes.func,
};

SearchForm.defaultProps = {
  setResult: () => {},
};

export default SearchForm;

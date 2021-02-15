import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchForm from './search.form';
import './search.scss';
import { Waves } from './svgWaveContainer';
import SwipeableListComp, { LIST_TYPES } from './swipeableList';

const Search = () => {
  const { t } = useTranslation();
  const [result, setResult] = useState([]);
  const [isSuggestion, setIsSuggestion] = useState();
  return (
    <div className="m-list__container">
      <div className="m-serach__containerInput">
        <SearchForm
          setResult={setResult}
          setIsSuggestion={setIsSuggestion}
          isSuggestion={isSuggestion}
        />
      </div>
      <Waves />
      <div className="m-playlist__container m-playlist__containerList">
        <div className="m-playlist__container__list">
          {isSuggestion && <p className="a-list__inspiration">{t('search.results.suggestions')}</p>}
          <SwipeableListComp result={result} type={LIST_TYPES.SEARCH} />
        </div>
      </div>
    </div>

  );
};
export default Search;

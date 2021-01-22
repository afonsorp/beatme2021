import React, { useState } from 'react';
import SearchForm from './search.form';
import './search.scss';
import { Waves } from './svgWaveContainer';
import SwipeableListComp, { LIST_TYPES } from './swipeableList';

const Search = () => {
  const [result, setResult] = useState([]);
  return (
    <div className="m-list__container">
      <div className="m-serach__containerInput">
        <SearchForm setResult={setResult} />
      </div>
      <div className="m-list__containerWaves">
        <Waves />

      </div>
      <div className="m-playlist__container m-playlist__containerList">
        <div className="m-playlist__container__list">
          <SwipeableListComp result={result} type={LIST_TYPES.SEARCH} />
        </div>
      </div>
    </div>

  );
};
export default Search;

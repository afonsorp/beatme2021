import React, { useState } from 'react';
import SearchForm from './search.form';
import './search.scss';
import SwipeableListComp, { LIST_TYPES } from './swipeableList';

const Search = () => {
  const [result, setResult] = useState([]);
  return (
    <div className="m-serach__container">
      <div className="m-serach__containerInput">
        <SearchForm setResult={setResult} />
      </div>
      <div className="m-serach__containerWaves">
        <svg className="m-song-exposer__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#F4B0B1"
            d="M0,128L40,133.3C80,139,160,149,240,133.3C320,117,400,75,480,85.3C560,96,640,160,720,176C800,192,880,160,960,176C1040,192,1120,256,1200,261.3C1280,267,1360,213,1400,186.7L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          />
        </svg>
      </div>
      <div className="m-playlist__container m-playlist__containerSearch">
        <div className="m-playlist__container__list">
          <SwipeableListComp result={result} type={LIST_TYPES.SEARCH} />
        </div>
      </div>
    </div>

  );
};
export default Search;

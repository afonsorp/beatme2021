/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import React from 'react';
import { Parallax } from 'react-parallax';
import { useSpotify } from '../common/spotifyProvider/spotifyProvider.useSpotify';
import './home.scss';
import { SongTimer } from '../common/utils/timer';
import PlaylistContainer from './playlistContainer';

const Home = () => {
  const { playing } = useSpotify();
  return (
    <Parallax
      renderLayer={() => (
        <div
          style={{
            position: 'relative',
            top: '1rem',
            width: '600px',
          }}
        >
          {playing && <img src={playing.album.backImage.url} alt={playing.artist.name} className="parallax__image" />}
          <div className="parallax">
            <span className="parallax__text">
              <div className="m-song-exposer__container">
                <div className="a-song-exposer__name">{playing ? playing.owner.name : 'N/A'}</div>
                <div className="a-song-exposer__song">
                  {playing ? `${playing.artist.name} - ` : 'N/A - '}
                  {playing ? playing.name : 'N/A'}
                </div>
                <div className="a-song-exposer__band"><SongTimer /></div>
              </div>
            </span>

          </div>
        </div>
      )}
    >
      {/* <Background className="parallax__text"> */}
      {/* </Background> */}

      <PlaylistContainer />

    </Parallax>
  );
};

export default Home;

// {playing && (
// <div className="parallax" style={{ backgroundImage: `url(${playing.album.backImage.url})` }}>
//   <span className="parallax__text">
//     <div className="m-song-exposer__container">
//       <div className="a-song-exposer__name">{playing ? playing.owner.name : 'N/A'}</div>
//       <div className="a-song-exposer__song">
//         {playing ? `${playing.artist.name} - ` : 'N/A - '}
//         {playing ? playing.name : 'N/A'}

//       </div>
//       <div className="a-song-exposer__band"><SongTimer /></div>
//     </div>
//   </span>

// </div>
// )}
// <PlaylistContainer />

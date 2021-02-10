/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import React from 'react';
import { Parallax } from 'react-parallax';
import { useSpotify } from '../common/spotifyProvider/spotifyProvider.useSpotify';
import './home.scss';
import { SongTimer } from '../common/utils/timer';
import PlaylistContainer from './playlistContainer';
import BlankCd from '../images/blank_cd.jpeg';

const Home = () => {
  const { playing } = useSpotify();
  const usename = playing && playing.owner ? playing.owner.name : 'N/A';
  const cover = playing && playing.album ? playing.album.backImage.url : BlankCd;
  const artist = playing && playing.artist ? playing.artist.name : 'N/A';
  const music = playing ? playing.name : 'N/A';

  return (
    <Parallax
      renderLayer={() => (
        <div
          className="paralax-container"
          // style={{
          //   position: 'relative',
          //   top: '1rem',
          //   width: '600px',
          // }}
        >
          <img src={cover} alt={artist} className="parallax__image" />
          <div className="parallax">
            <span className="parallax__text">
              <div className="m-song-exposer__container">
                <div className="a-song-exposer__name">{usename}</div>
                <div className="a-song-exposer__song">
                  {`${artist} - `}
                  {music}
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

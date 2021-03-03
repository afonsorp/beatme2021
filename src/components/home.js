/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import React from 'react';
// import { Parallax, Background } from 'react-parallax';
import { useSpotify } from '../common/spotifyProvider/spotifyProvider.useSpotify';
import './home.scss';
import { SongTimer } from '../common/utils/timer';
import PlaylistContainer from './playlistContainer';
import BlankCd from '../images/blank_cd.jpeg';
import { Waves } from './svgWaveContainer';

const Home = () => {
  const { playing } = useSpotify();
  const usename = playing && playing.owner ? playing.owner.name : 'N/A';
  const cover = playing && playing.album ? playing.album.middleImage.url : BlankCd;
  const albumImage = playing && playing.album ? playing.album.middleImage.url : BlankCd;
  const artist = playing && playing.artist ? playing.artist.name : 'N/A';
  const music = playing ? playing.name : 'N/A';

  return (

    <div className="parallax-container">
      <div className="parallax-image">
        <div className="parallax-background">
          <container className="parallax-background__container" style={{ backgroundImage: `url(${cover})` }} />
          <span className="parallax-background__miniAlbum" style={{ backgroundImage: `url(${albumImage})` }} />
          <center>
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

          </center>
          {/* </container> */}
        </div>
        <div className="parallax-playlist">
          {/* <center> */}
          <Waves className="parallax-playlist-waves--home" />
          <PlaylistContainer />
          {/* </center> */}
        </div>
      </div>
    </div>

  // <Parallax
  //   renderLayer={() => (
  //     <div
  //       className="paralax-container"
  //     >
  //       <Background>
  //         <img src={cover} alt={artist} className="parallax__image" />
  //       </Background>
  //       <div className="parallax">
  //         <span className="parallax__text">
  //           <div className="m-song-exposer__container">
  //             <div className="a-song-exposer__name">{usename}</div>
  //             <div className="a-song-exposer__song">
  //               {`${artist} - `}
  //               {music}
  //             </div>
  //             <div className="a-song-exposer__band"><SongTimer /></div>
  //           </div>
  //         </span>
  //       </div>
  //       <PlaylistContainer />
  //     </div>
  //   )}
  // />
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

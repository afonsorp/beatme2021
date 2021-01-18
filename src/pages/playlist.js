import React from 'react';
import PlaylistContainer from '../components/playlistContainer';
import SongExposer from '../components/songExposer';
import TopMenu from '../components/topMenu';

const Playlist = () => (
  <>
    <TopMenu />
    <SongExposer />
    <PlaylistContainer />
  </>

);

export default Playlist;

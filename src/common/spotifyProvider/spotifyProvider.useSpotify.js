import { useContext } from 'react';
import SpotifyContext from './spotifyProvider.context';

export const useSpotify = () => useContext(SpotifyContext);

export default useSpotify;

import { contextHoc } from '../contextHoc';
import SpotifyContext from './spotifyProvider.context';

export const withSpotify = contextHoc(SpotifyContext);

export default withSpotify;

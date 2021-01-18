import { Model } from 'objectmodel';
import { DEF_SPOTIFY_COUNTRY } from '../spotifyProvider/spotifyProvider.provider';

class AdminDetails extends Model({
  country: [String, undefined],
  favGenres: [Object, undefined],
  location: [Object, undefined],
  songLimit: [Number, String, undefined],
  needsConfiguration: [Boolean, undefined],
}) {
  get details() {
    return {
      country: this.country || DEF_SPOTIFY_COUNTRY,
      favGenres: this.favGenres || [],
      location: this.location || { lat: undefined, lng: undefined },
      songLimit: this.songLimit || 3,
      needsConfiguration: this.needsConfiguration
        || (!this.location
        || !this.location.lat
        || !this.location.lng),
    };
  }
}

export default AdminDetails;

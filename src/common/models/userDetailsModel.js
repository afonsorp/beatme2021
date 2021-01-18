import { Model } from 'objectmodel';

class UserDetails extends Model({
  favorites: [Object, undefined], lastSongByUser: [String, undefined],
}) {
  get details() {
    return {
      favorites: this.favorites || [],
      lastSongByUser: this.lastSongByUser || null,
    };
  }
}

export default UserDetails;

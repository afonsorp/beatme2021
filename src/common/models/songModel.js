import { Model } from 'objectmodel';
import AlbumModel from './albumModel';
import ArtistModel from './artistModel';

class SongModel extends Model({
  uri: String, name: String, duration_ms: Number, album: Object, user: Object,
}) {
  get song() {
    return {
      uri: this.uri,
      name: this.name,
      duration: this.duration_ms,
      votes: [],
      position: 0,
      album: new AlbumModel(this.album).album,
      artist: new ArtistModel(this.artists[0]).artist,
      owner: {
        uid: this.user.uid,
        name: this.user.name,
        photoURL: this.user.photoURL,
      },
    };
  }
}

export default SongModel;

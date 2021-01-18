import { Model } from 'objectmodel';

class PlaylistModel extends Model({
  playlist: [Array, undefined], played: [Array, undefined], playing: [Object, undefined],
}) {
  get list() {
    return {
      action: new Date().toISOString(),
      playlist: this.playlist || [],
      played: this.played || [],
      playing: this.playing || {},
    };
  }
}

export default PlaylistModel;

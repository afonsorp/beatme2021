import { Model } from 'objectmodel';

class ArtistModel extends Model({
  uri: String, name: String,
}) {
  get artist() {
    return {
      uri: this.uri,
      name: this.name,
    };
  }
}

export default ArtistModel;

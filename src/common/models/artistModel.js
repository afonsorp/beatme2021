import { Model } from 'objectmodel';

class ArtistModel extends Model({
  uri: String, name: String, id: String,
}) {
  get artist() {
    return {
      id: this.id,
      uri: this.uri,
      name: this.name,
    };
  }
}

export default ArtistModel;

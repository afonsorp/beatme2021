import { Model } from 'objectmodel';
import BlankCd from '../../images/blank_cd.jpeg';

class AlbumModel extends Model({
  uri: String, name: String, images: Array,
}) {
  get album() {
    return {
      uri: this.uri,
      name: this.name,
      backImage: this.images ? this.images[1] : BlankCd,
      avatarImage: this.images ? this.images[2] : BlankCd,
    };
  }
}

export default AlbumModel;

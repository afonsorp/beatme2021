import { Model } from 'objectmodel';
import BlankCd from '../../images/blank_cd.jpeg';

const blankCd = [{ height: 640, url: BlankCd, width: 640 },
  { height: 300, url: BlankCd, width: 300 },
  { height: 64, url: BlankCd, width: 64 }];

class AlbumModel extends Model({
  uri: String, name: String, images: Array,
}) {
  get album() {
    return {
      uri: this.uri,
      name: this.name,
      backImage: this.images.length ? this.images[0] : blankCd[0],
      avatarImage: this.images.length ? this.images[2] : blankCd[2],
    };
  }
}

export default AlbumModel;

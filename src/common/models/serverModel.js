import { Model } from 'objectmodel';

class Server extends Model({
  lat: [String, Number],
  lng: [String, Number],
  active: Boolean,
}) {
  get server() {
    return {
      lat: this.lat,
      lng: this.lng,
      active: this.active,
      action: new Date().toISOString(),
    };
  }
}

export default Server;

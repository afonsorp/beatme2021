import { Model } from 'objectmodel';
import AdminDetails from './adminDetailsModel';
import UserDetails from './userDetailsModel';

export const isAdministrator = (uid) => uid.includes('spotify');

class User extends Model({
  name: [String, undefined],
  displayName: [String, undefined],
  email: [String, undefined, null],
  photoURL: String,
  uid: String,
  details: Object,
}) {
  get user() {
    const isAdmin = isAdministrator(this.uid);
    return {
      name: this.name || this.displayName || 'N/A',
      photoURL: this.photoURL,
      isAdmin,
      uid: this.uid,
      email: this.email,
      details: isAdmin
        ? new AdminDetails(this.details).details
        : new UserDetails(this.details).details,
    };
  }
}

export default User;

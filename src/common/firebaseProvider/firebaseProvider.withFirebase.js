import { contextHoc } from '../contextHoc';
import FirebaseContext from './firebaseProvider.context';

export const withFirebase = contextHoc(FirebaseContext);

export default withFirebase;

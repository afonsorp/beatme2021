import { useContext } from 'react';
import FirebaseContext from './firebaseProvider.context';

export const useFirebase = () => useContext(FirebaseContext);

export default useFirebase;

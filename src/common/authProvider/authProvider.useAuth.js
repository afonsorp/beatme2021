import { useContext } from 'react';
import AuthContext from './authProvider.context';

export const useAuth = () => useContext(AuthContext);

export default useAuth;

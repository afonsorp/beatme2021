import { contextHoc } from '../contextHoc';
import AuthContext from './authProvider.context';

export const withAuth = contextHoc(AuthContext);

export default withAuth;

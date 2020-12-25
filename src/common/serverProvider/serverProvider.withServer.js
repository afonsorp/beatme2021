import { contextHoc } from '../contextHoc';
import ServerContext from './serverProvider.context';

export const withServer = contextHoc(ServerContext);

export default withServer;

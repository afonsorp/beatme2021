import { useContext } from 'react';
import ServerContext from './serverProvider.context';

export const useServer = () => useContext(ServerContext);

export default useServer;

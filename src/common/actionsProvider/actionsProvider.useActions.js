import { useContext } from 'react';
import ActionsContext from './actionsProvider.context';

export const useActions = () => useContext(ActionsContext);

export default useActions;

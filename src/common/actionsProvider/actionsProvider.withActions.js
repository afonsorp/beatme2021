import { contextHoc } from '../contextHoc';
import ActionsContext from './actionsProvider.context';

export const withActions = contextHoc(ActionsContext);

export default withActions;

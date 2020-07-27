import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import rocket from './rocket';
import launches from './launches';

export default (history) => combineReducers({
  router: connectRouter(history),
  rocket,
  launches
});

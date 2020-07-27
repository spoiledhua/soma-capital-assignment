import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './redux/reducers';

export default (initialState, history) => {
  // Installs hooks that always keep react-router and redux store in sync
  const middleware = [
    thunk,
    routerMiddleware(history),
  ];
  let store;
  middleware.push(createLogger());
  store = createStore(rootReducer(history), initialState, compose(
    applyMiddleware(...middleware),
    typeof window === 'object' && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
  ));
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./redux/reducers', () => {
      const nextReducer = require('./redux/reducers');
      store.replaceReducer(nextReducer);
    });
  }
  return store;
};

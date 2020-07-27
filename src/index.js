import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';

import * as serviceWorker from './serviceWorker';
import configureStore from './configureStore';
import createRoutes from './routes';

import './main.css';

const initialState = {};

const history = createBrowserHistory();
const store = configureStore(initialState, history);
const routes = createRoutes(store);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      {renderRoutes(routes)}
    </ConnectedRouter>
  </Provider>,
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

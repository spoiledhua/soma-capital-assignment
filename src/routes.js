/// layouts
import AppLayout from './layouts/AppLayout';

// pages
import HomePage from './pages/HomePage';

/*
 * @param {Redux Store}
 * We require store as an argument here because we wish to get
 * state from the store after it has been authenticated.
 * https://reacttraining.com/react-router/web/guides/server-rendering/data-loading
 */
export default () => {
  return [
    {
      component: AppLayout,
      routes: [
        {
          component: HomePage,
          path: '/',
          exact: true,
        },
        {
          component: HomePage,
          path: '*',
          exact: true,
        },
      ]
    }
  ];
};

if (module.hot) {
  module.hot.accept();
}

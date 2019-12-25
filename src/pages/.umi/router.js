import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@tmp/history';
import { routerRedux } from 'dva';

const Router = routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/login',
    component: require('../login').default,
    exact: true,
  },
  {
    path: '/',
    component: require('../../layout/index').default,
    routes: [
      {
        path: '/goods',
        component: require('../goods').default,
        exact: true,
      },
      {
        path: '/about',
        component: require('../about').default,
        Routes: [require('../../../routes/privateRoute.js').default],
        exact: true,
      },
      {
        path: '/users',
        component: require('../users/_layout').default,
        routes: [
          {
            path: '/users',
            component: require('../users/index').default,
            exact: true,
          },
          {
            path: '/users/:name',
            component: require('../users/$name').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/chenjg26809/AppData/Roaming/npm/node_modules/umi/node_modules/_umi-build-dev@1.13.13@umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        component: require('../notFound').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('C:/Users/chenjg26809/AppData/Roaming/npm/node_modules/umi/node_modules/_umi-build-dev@1.13.13@umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    component: () =>
      React.createElement(
        require('C:/Users/chenjg26809/AppData/Roaming/npm/node_modules/umi/node_modules/_umi-build-dev@1.13.13@umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    routeChangeHandler(history.location);
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return <Router history={history}>{renderRoutes(routes, props)}</Router>;
  }
}

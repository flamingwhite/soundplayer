import React from 'react';
import 'rxjs';
import 'babel-polyfill';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './routeConfig/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';

const store = configureStore();

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept('./routeConfig/Root', () => {
    const NextRoot = require('./routeConfig/Root'); // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root'),
    );
  });
}

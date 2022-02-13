import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from 'views/pages/app';
import { store } from 'store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { ErrorBoundary } from 'error-boundary';

// Deactivate all console.log on production
// eslint-disable-next-line @typescript-eslint/no-empty-function
process.env.NODE_ENV === 'production' && (console.log = () => {});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

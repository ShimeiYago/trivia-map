import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from 'views/pages/app';
import { store } from 'store';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import { ErrorBoundary } from 'error-boundary';

// Deactivate all console.log on production
// eslint-disable-next-line @typescript-eslint/no-empty-function
process.env.NODE_ENV === 'production' && (console.log = () => {});

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route index element={<App />} />
            <Route path="/posts/:id" element={<div>Post Page (TODO)</div>} />
            <Route path="*" element={<div>404 not found (TODO)</div>} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

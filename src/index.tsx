import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { store } from 'store';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import { ErrorBoundary } from 'error-boundary';
import { MapPage } from 'views/pages/map-page';
import { Article } from 'views/pages/article';
import { VerifyEmail } from 'views/pages/verify-email';
import { Login } from 'views/pages/login';
import { Admin } from 'views/pages/admin';
import { AccountSettings } from 'views/pages/account-setting';

// Deactivate all console.log on production
// eslint-disable-next-line @typescript-eslint/no-empty-function
process.env.NODE_ENV === 'production' && (console.log = () => {});

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route index element={<MapPage />} />
            <Route path="/edit/:postId" element={<MapPage />} />
            <Route path="/article/:postId" element={<Article />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/account" element={<AccountSettings />} />
            <Route path="/verify-email/:verifyKey" element={<VerifyEmail />} />
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

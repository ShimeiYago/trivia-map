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
import { AccountSettings } from 'views/pages/account-settings';
import { ProfileEdit } from 'views/pages/profile-edit';
import {
  ACCOUNT_SETTINGS_LINK,
  ADMIN_LINK,
  ARTICLE_PAGE_LINK,
  EDIT_LINK,
  INTERNAL_ERROR_LINK,
  LOGIN_LINK,
  PASSWORD_CHANGE_LINK,
  PROFILE_SETTINGS_LINK,
  RESET_PASSWORD_LINK,
  VERIFY_EMAIL_LINK,
} from 'constant/links';
import { ChangePassword } from 'views/pages/change-password';
import { ResetPassword } from 'views/pages/reset-password';
import { NotFoundErrorPage } from 'views/pages/not-found-error-page';
import { InternalErrorPage } from 'views/pages/internal-error-page';
import { GlobalErrorHandler } from 'views/components/organisms/global-error-handler';

// Deactivate all console.log on production
// eslint-disable-next-line @typescript-eslint/no-empty-function
process.env.NODE_ENV === 'production' && (console.log = () => {});

function errorHandledElement(element: React.ReactNode) {
  return <GlobalErrorHandler>{element}</GlobalErrorHandler>;
}

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route index element={<MapPage />} />
            <Route
              path={EDIT_LINK(':postId')}
              element={errorHandledElement(<MapPage />)}
            />
            <Route
              path={ARTICLE_PAGE_LINK(':postId')}
              element={errorHandledElement(<Article />)}
            />
            <Route path={LOGIN_LINK} element={errorHandledElement(<Login />)} />
            <Route path={ADMIN_LINK} element={errorHandledElement(<Admin />)} />
            <Route
              path={ACCOUNT_SETTINGS_LINK}
              element={errorHandledElement(<AccountSettings />)}
            />
            <Route
              path={PROFILE_SETTINGS_LINK}
              element={errorHandledElement(<ProfileEdit />)}
            />
            <Route
              path={PASSWORD_CHANGE_LINK}
              element={errorHandledElement(<ChangePassword />)}
            />
            <Route
              path={VERIFY_EMAIL_LINK(':verifyKey')}
              element={errorHandledElement(<VerifyEmail />)}
            />
            <Route
              path={RESET_PASSWORD_LINK(':uid', ':token')}
              element={errorHandledElement(<ResetPassword />)}
            />
            <Route path={INTERNAL_ERROR_LINK} element={<InternalErrorPage />} />
            <Route path="*" element={<NotFoundErrorPage />} />
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

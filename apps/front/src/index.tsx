import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { store } from 'store';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import { ErrorBoundary } from 'helper-components/error-boundary';
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
  NOT_FOUND_LINK,
  PASSWORD_CHANGE_LINK,
  PROFILE_SETTINGS_LINK,
  RESET_PASSWORD_LINK,
  VERIFY_EMAIL_LINK,
  AUTHER_PAGE_LINK,
  ARTICLE_LIST_PAGE_LINK,
  MY_ARTICLES_LINK,
  INQUIRY_PAGE_LINK,
  TERMS_PAGE_LINK,
  CATEGORY_PAGE_LINK,
  SIGNUP_LINK,
  TWITTER_CALLBACK_LINK,
  DEACTIVATE_ACCOUNT_LINK,
  NEW_LINK,
  LIKED_ARTICLES_LINK,
  TWITTER_LOGIN_LINK,
  MAP_USER_LINK,
  PRIVACY_POLICY_PAGE_LINK,
  SPECIAL_MAP_PAGE_LINK,
  SPECIAL_MAP_LIST_PAGE_LINK,
  SPECIAL_MAP_DETAIL_PAGE_LINK,
  SPECIAL_MAP_EDIT_PAGE_LINK,
  SPECIAL_MAP_NEW_PAGE_LINK,
  SPECIAL_MAP_MANAGE_PAGE_LINK,
} from 'constant/links';
import { ChangePassword } from 'views/pages/change-password';
import { ResetPassword } from 'views/pages/reset-password';
import { CommonErrorPage } from 'views/pages/common-error-page';
import { GlobalErrorHandler } from 'views/components/organisms/global-error-handler';
import { ArticleList } from 'views/pages/article-list';
import { AuthorPage } from 'views/pages/author';
import { MyArticles } from 'views/pages/my-articles';
import { InquiryPage } from 'views/pages/inquiry-page';
import { TermsPage } from 'views/pages/terms-page';
import { CategoryPage } from 'views/pages/category-page';
import { CookiesProvider } from 'react-cookie';
import { TwitterCallbackPage } from 'views/pages/twitter-callback-page';
import { DeactivateAccount } from 'views/pages/deactivate-account';
import { LikedArticles } from 'views/pages/liked-articles';
import { TwitterLoginPage } from 'views/pages/twitter-login-page';
import { PrivacyPage } from 'views/pages/privacy-page';
import { SpecialMapPage } from 'views/pages/special-map-page';
import { SpecialMapListPage } from 'views/pages/special-map-list-page';
import { SpecialMapDetailPage } from 'views/pages/special-map-detail-page';
import { Tracker } from 'helper-components/tracker';
import { SpecialMapNewPage } from 'views/pages/special-map-new-page';
import { SpecialMapManagePage } from 'views/pages/special-map-manege-page';

// Deactivate all console.log on production
// eslint-disable-next-line @typescript-eslint/no-empty-function
process.env.NODE_ENV === 'production' && (console.log = () => {});

function errorHandledElement(element: React.ReactNode) {
  return <GlobalErrorHandler>{element}</GlobalErrorHandler>;
}

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <CookiesProvider>
        <HelmetProvider>
          <Provider store={store}>
            <BrowserRouter>
              <Tracker>
                <Routes>
                  <Route index element={errorHandledElement(<MapPage />)} />
                  <Route
                    path={MAP_USER_LINK(':userId')}
                    element={errorHandledElement(<MapPage />)}
                  />
                  <Route path={NEW_LINK} element={errorHandledElement(<MapPage new />)} />
                  <Route path={EDIT_LINK(':postId')} element={errorHandledElement(<MapPage />)} />
                  <Route
                    path={ARTICLE_PAGE_LINK(':postId')}
                    element={errorHandledElement(<Article />)}
                  />
                  <Route
                    path={ARTICLE_LIST_PAGE_LINK}
                    element={errorHandledElement(<ArticleList />)}
                  />
                  <Route
                    path={AUTHER_PAGE_LINK(':userId')}
                    element={errorHandledElement(<AuthorPage />)}
                  />
                  <Route
                    path={CATEGORY_PAGE_LINK(':categoryId')}
                    element={errorHandledElement(<CategoryPage />)}
                  />

                  <Route
                    path={SPECIAL_MAP_LIST_PAGE_LINK}
                    element={errorHandledElement(<SpecialMapListPage />)}
                  />
                  <Route
                    path={SPECIAL_MAP_NEW_PAGE_LINK}
                    element={errorHandledElement(<SpecialMapNewPage />)}
                  />
                  <Route
                    path={SPECIAL_MAP_PAGE_LINK(':mapId')}
                    element={errorHandledElement(<SpecialMapPage />)}
                  />
                  <Route
                    path={SPECIAL_MAP_EDIT_PAGE_LINK(':mapId')}
                    element={errorHandledElement(<SpecialMapPage edit />)}
                  />
                  <Route
                    path={SPECIAL_MAP_DETAIL_PAGE_LINK(':mapId')}
                    element={errorHandledElement(<SpecialMapDetailPage />)}
                  />
                  <Route
                    path={SPECIAL_MAP_MANAGE_PAGE_LINK}
                    element={errorHandledElement(<SpecialMapManagePage />)}
                  />

                  <Route path={LOGIN_LINK} element={errorHandledElement(<Login page="login" />)} />
                  <Route
                    path={SIGNUP_LINK}
                    element={errorHandledElement(<Login page="signup" />)}
                  />
                  <Route path={ADMIN_LINK} element={errorHandledElement(<Admin />)} />
                  <Route path={MY_ARTICLES_LINK} element={errorHandledElement(<MyArticles />)} />
                  <Route
                    path={LIKED_ARTICLES_LINK}
                    element={errorHandledElement(<LikedArticles />)}
                  />
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
                    path={DEACTIVATE_ACCOUNT_LINK}
                    element={errorHandledElement(<DeactivateAccount />)}
                  />
                  <Route
                    path={VERIFY_EMAIL_LINK(':verifyKey')}
                    element={errorHandledElement(<VerifyEmail />)}
                  />
                  <Route
                    path={RESET_PASSWORD_LINK(':uid', ':token')}
                    element={errorHandledElement(<ResetPassword />)}
                  />
                  <Route path={NOT_FOUND_LINK} element={<CommonErrorPage errorStatus={404} />} />
                  <Route path={INQUIRY_PAGE_LINK} element={errorHandledElement(<InquiryPage />)} />
                  <Route path={TERMS_PAGE_LINK} element={errorHandledElement(<TermsPage />)} />
                  <Route
                    path={PRIVACY_POLICY_PAGE_LINK}
                    element={errorHandledElement(<PrivacyPage />)}
                  />
                  <Route
                    path={TWITTER_LOGIN_LINK}
                    element={errorHandledElement(<TwitterLoginPage />)}
                  />
                  <Route
                    path={TWITTER_CALLBACK_LINK}
                    element={errorHandledElement(<TwitterCallbackPage />)}
                  />
                  <Route
                    path={INTERNAL_ERROR_LINK}
                    element={<CommonErrorPage errorStatus={500} />}
                  />
                  <Route path="*" element={<CommonErrorPage errorStatus={404} />} />
                </Routes>
              </Tracker>
            </BrowserRouter>
          </Provider>
        </HelmetProvider>
      </CookiesProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

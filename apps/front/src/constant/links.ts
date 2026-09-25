import { Park } from 'types/park';
import { getUrlParameters } from 'utils/get-url-parameters';

export const LOGIN_LINK = '/login';

export const SIGNUP_LINK = '/signup';

export const ADMIN_LINK = '/admin';

export const MY_ARTICLES_LINK = '/admin/articles';

export const LIKED_ARTICLES_LINK = '/admin/likes';

export const ACCOUNT_SETTINGS_LINK = '/admin/account';

export const PROFILE_SETTINGS_LINK = '/admin/account/profile';

export const PASSWORD_CHANGE_LINK = '/admin/account/password';

export const DEACTIVATE_ACCOUNT_LINK = '/admin/account/deactivate';

export const ARTICLE_PAGE_LINK = (postId: string) => `/articles/${postId}`;

export const MAP_ROUTE = '/map';
export const MAP_USER_LINK = (userId: string) => `${MAP_ROUTE}/user/${userId}`;
export const NEW_LINK = `${MAP_ROUTE}/new`;
export const EDIT_LINK = (postId: string) => `${MAP_ROUTE}/edit/${postId}`;

export const ARTICLE_LIST_PAGE_LINK = '/articles';

export const AUTHER_PAGE_LINK = (userId: string) => `/users/${userId}`;

export const CATEGORY_PAGE_LINK = (categoryId: string) => `/categories/${categoryId}`;

export const VERIFY_EMAIL_LINK = (verifyKey: string) => `/verify-email/${verifyKey}`;

export const RESET_PASSWORD_LINK = (uid: string, token: string) =>
  `/reset-password/${uid}/${token}`;

export const MAP_PAGE_LINK = '/';
export const MAP_PAGE_LINK_WITH_CATEGORY = (categoryId: number) =>
  `${MAP_PAGE_LINK}?category=${categoryId}`;

export const NOT_FOUND_LINK = '/error/404';

export const INTERNAL_ERROR_LINK = '/error/500';

export const INQUIRY_PAGE_LINK = '/inquiry';

export const TERMS_PAGE_LINK = '/terms-of-service';

export const PRIVACY_POLICY_PAGE_LINK = '/privacy-policy';

export const TWITTER_CALLBACK_LINK = '/twitter-auth-callback';

export const TWITTER_LOGIN_LINK = '/twitter-login';

export const SPECIAL_MAP_LIST_PAGE_LINK = '/special-maps';

export const SPECIAL_MAP_NEW_PAGE_LINK = '/special-maps/new';

export const SPECIAL_MAP_PAGE_LINK = (mapId: string, param?: { marker?: number; park?: Park }) => {
  let url = `/special-maps/${mapId}`;
  if (param) {
    url += getUrlParameters(param);
  }
  return url;
};

export const SPECIAL_MAP_EDIT_PAGE_LINK = (mapId: string) => `/special-maps/edit/${mapId}`;

export const SPECIAL_MAP_DETAIL_PAGE_LINK = (mapId: string) => `/special-maps/detail/${mapId}`;

export const SPECIAL_MAP_MANAGE_PAGE_LINK = '/admin/special-maps';

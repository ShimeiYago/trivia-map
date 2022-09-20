export const LOGIN_LINK = '/login';

export const ADMIN_LINK = '/admin';

export const MY_ARTICLES_LINK = '/admin/articles';

export const ACCOUNT_SETTINGS_LINK = '/admin/account';

export const PROFILE_SETTINGS_LINK = '/admin/account/profile';

export const PASSWORD_CHANGE_LINK = '/admin/account/password';

export const ARTICLE_PAGE_LINK = (postId: string) => `/articles/${postId}`;

export const EDIT_LINK = (postId: string) => `/map/edit/${postId}`;

export const ARTICLE_LIST_PAGE_LINK = '/articles';

export const AUTHER_PAGE_LINK = (userId: string) => `/users/${userId}`;

export const VERIFY_EMAIL_LINK = (verifyKey: string) =>
  `/verify-email/${verifyKey}`;

export const RESET_PASSWORD_LINK = (uid: string, token: string) =>
  `/reset-password/${uid}/${token}`;

export const MAP_PAGE_LINK = '/';

export const NOT_FOUND_LINK = '/error/404';

export const INTERNAL_ERROR_LINK = '/error/500';

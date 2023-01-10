import {
  ADMIN_LINK,
  MY_ARTICLES_LINK,
  ACCOUNT_SETTINGS_LINK,
  LIKED_ARTICLES_LINK,
} from 'constant/links';
import { PAGE_NAMES } from 'constant/page-names';

export const authMenuLinks = [
  { path: ADMIN_LINK, text: PAGE_NAMES.admin },
  { path: MY_ARTICLES_LINK, text: PAGE_NAMES.myArticles },
  { path: LIKED_ARTICLES_LINK, text: PAGE_NAMES.likedArticles },
  { path: ACCOUNT_SETTINGS_LINK, text: PAGE_NAMES.accountSettings },
];

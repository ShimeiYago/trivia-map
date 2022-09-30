import React from 'react';
import { Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  ACCOUNT_SETTINGS_LINK,
  ADMIN_LINK,
  ARTICLE_LIST_PAGE_LINK,
  INQUIRY_PAGE_LINK,
  LOGIN_LINK,
  MAP_PAGE_LINK,
  MY_ARTICLES_LINK,
  PRIVACY_POLICY_PAGE_LINK,
} from 'constant/links';
import MapIcon from '@mui/icons-material/Map';
import ArticleIcon from '@mui/icons-material/Article';
import { NonStyleLink } from 'views/components/atoms/non-style-link';
import LoginIcon from '@mui/icons-material/Login';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EmailIcon from '@mui/icons-material/Email';
import InfoIcon from '@mui/icons-material/Info';
import { PAGE_NAMES } from 'constant/page-names';
import { SITE_NAME } from 'constant';

const listItemsForMap: ListItem[] = [
  {
    text: SITE_NAME,
    icon: <MapIcon />,
    link: MAP_PAGE_LINK,
  },
  {
    text: PAGE_NAMES.articles,
    icon: <ArticleIcon />,
    link: ARTICLE_LIST_PAGE_LINK,
  },
];

const listItemsForLogin: ListItem[] = [
  {
    text: PAGE_NAMES.login,
    icon: <LoginIcon />,
    link: LOGIN_LINK,
  },
];

const listItemsForAdmin: ListItem[] = [
  {
    text: PAGE_NAMES.admin,
    icon: <AdminPanelSettingsIcon />,
    link: ADMIN_LINK,
  },
  {
    text: PAGE_NAMES.myArticles,
    icon: <ListAltIcon />,
    link: MY_ARTICLES_LINK,
  },
  {
    text: PAGE_NAMES.accountSettings,
    icon: <ManageAccountsIcon />,
    link: ACCOUNT_SETTINGS_LINK,
  },
];

const listItemsOthers: ListItem[] = [
  {
    text: PAGE_NAMES.inquiry,
    icon: <EmailIcon />,
    link: INQUIRY_PAGE_LINK,
  },
  {
    text: PAGE_NAMES.policy,
    icon: <InfoIcon />,
    link: PRIVACY_POLICY_PAGE_LINK,
  },
];

const listItemMapping = (items: ListItem[]) => {
  return items.map((item, index) => (
    <NonStyleLink to={item.link} key={index}>
      <ListItem button>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItem>
    </NonStyleLink>
  ));
};

export const leftNaviContents = (login: boolean) => (
  <>
    <List>{listItemMapping(listItemsForMap)}</List>
    <Divider />
    <List>{listItemMapping(login ? listItemsForAdmin : listItemsForLogin)}</List>
    <Divider />
    <List>{listItemMapping(listItemsOthers)}</List>
  </>
);

type ListItem = {
  text: string;
  icon: React.ReactNode;
  link: string;
};

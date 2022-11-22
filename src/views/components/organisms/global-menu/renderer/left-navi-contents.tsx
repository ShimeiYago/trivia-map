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
  SIGNUP_LINK,
} from 'constant/links';
import MapIcon from '@mui/icons-material/Map';
import ArticleIcon from '@mui/icons-material/Article';
import { NonStyleLink } from 'views/components/atoms/non-style-link';
import LoginIcon from '@mui/icons-material/Login';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EmailIcon from '@mui/icons-material/Email';
import InfoIcon from '@mui/icons-material/Info';
import { PAGE_NAMES } from 'constant/page-names';
import { SITE_NAME } from 'constant';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

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
  {
    text: PAGE_NAMES.signup,
    icon: <PersonAddIcon />,
    link: SIGNUP_LINK,
  },
];

const listItemsForAdmin: ListItem[] = [
  {
    text: PAGE_NAMES.admin,
    icon: <AccountCircleIcon />,
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

const listItemMapping = (items: ListItem[], pathName: string) => {
  return items.map((item, index) => {
    if (pathName === item.link) {
      return (
        <ListItem selected key={index}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      );
    }

    return (
      <NonStyleLink to={item.link} key={index}>
        <ListItem button>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      </NonStyleLink>
    );
  });
};

export const leftNaviContents = (login: boolean, pathName: string) => (
  <>
    <List>{listItemMapping(listItemsForMap, pathName)}</List>
    <Divider />
    <List>{listItemMapping(login ? listItemsForAdmin : listItemsForLogin, pathName)}</List>
    <Divider />
    <List>{listItemMapping(listItemsOthers, pathName)}</List>
  </>
);

type ListItem = {
  text: string;
  icon: React.ReactNode;
  link: string;
};

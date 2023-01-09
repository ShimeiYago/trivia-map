import React from 'react';
import { Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  ACCOUNT_SETTINGS_LINK,
  ADMIN_LINK,
  ARTICLE_LIST_PAGE_LINK,
  INQUIRY_PAGE_LINK,
  LIKED_ARTICLES_LINK,
  LOGIN_LINK,
  MAP_PAGE_LINK,
  MAP_ROUTE,
  MY_ARTICLES_LINK,
  NEW_LINK,
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
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const listItemsForMap: ListItem[] = [
  {
    text: SITE_NAME,
    icon: <MapIcon />,
    link: MAP_PAGE_LINK,
  },
  {
    text: PAGE_NAMES.new,
    icon: <AddLocationAltIcon />,
    link: NEW_LINK,
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
    text: PAGE_NAMES.likedArticles,
    icon: <ThumbUpIcon />,
    link: LIKED_ARTICLES_LINK,
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

const listItemMapping = (
  items: ListItem[],
  pathName: string,
  isFormEditting: boolean,
  onClose: () => void,
) => {
  return items.map((item, index) => {
    if (shouldDisable(pathName, item.link, isFormEditting)) {
      return (
        <ListItem selected key={index}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      );
    }

    return (
      <NonStyleLink to={item.link} key={index}>
        <ListItem button onClick={onClose}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      </NonStyleLink>
    );
  });
};

export const leftNaviContents = (
  login: boolean,
  pathName: string,
  isFormEditting: boolean,
  onClose: () => void,
) => (
  <>
    <List>{listItemMapping(listItemsForMap, pathName, isFormEditting, onClose)}</List>
    <Divider />
    <List>
      {listItemMapping(
        login ? listItemsForAdmin : listItemsForLogin,
        pathName,
        isFormEditting,
        onClose,
      )}
    </List>
    <Divider />
    <List>{listItemMapping(listItemsOthers, pathName, isFormEditting, onClose)}</List>
  </>
);

function shouldDisable(pathName: string, link: string, isFormEditting: boolean) {
  if (isMapPage(pathName) && link === NEW_LINK) {
    return isFormEditting;
  }

  return pathName === link || (isMapPage(pathName) && link === MAP_PAGE_LINK);
}

function isMapPage(pathName: string) {
  return !pathName.indexOf(MAP_ROUTE) || pathName === MAP_PAGE_LINK;
}

type ListItem = {
  text: string;
  icon: React.ReactNode;
  link: string;
};

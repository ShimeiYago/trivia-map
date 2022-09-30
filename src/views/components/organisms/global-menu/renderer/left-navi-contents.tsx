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

const listItemsForMap: ListItem[] = [
  {
    text: 'マップ',
    icon: <MapIcon />,
    link: MAP_PAGE_LINK,
  },
  {
    text: '投稿一覧＆検索',
    icon: <ArticleIcon />,
    link: ARTICLE_LIST_PAGE_LINK,
  },
];

const listItemsForLogin: ListItem[] = [
  {
    text: 'ログイン',
    icon: <LoginIcon />,
    link: LOGIN_LINK,
  },
];

const listItemsForAdmin: ListItem[] = [
  {
    text: 'マイページ',
    icon: <AdminPanelSettingsIcon />,
    link: ADMIN_LINK,
  },
  {
    text: 'マイ投稿一覧＆管理',
    icon: <ListAltIcon />,
    link: MY_ARTICLES_LINK,
  },
  {
    text: 'アカウント設定',
    icon: <ManageAccountsIcon />,
    link: ACCOUNT_SETTINGS_LINK,
  },
];

const listItemsOthers: ListItem[] = [
  {
    text: 'お問い合わせ',
    icon: <EmailIcon />,
    link: INQUIRY_PAGE_LINK,
  },
  {
    text: 'プライバシーポリシー',
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

import React from 'react';
import { Avatar, Stack, Typography } from '@mui/material';
import { User } from 'types/user';
import { AdminWrapper } from 'views/components/organisms/admin-wrapper';
import noIcon from 'images/no-icon.jpg';
import { BackToNavi } from 'views/components/moleculars/back-to-navi';
import { ACCOUNT_SETTINGS_LINK, MAP_PAGE_LINK, MY_ARTICLES_LINK } from 'constant/links';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { LinkList } from 'views/components/moleculars/link-list';
import { PAGE_NAMES } from 'constant/page-names';
import { SITE_NAME } from 'constant';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { HeadAppender } from 'helper-components/head-appender';

export class Renderer extends React.Component<Props> {
  render() {
    return (
      <HeadAppender title={pageTitleGenerator(PAGE_NAMES.admin)}>
        <AdminWrapper>{this.renderContents()}</AdminWrapper>
      </HeadAppender>
    );
  }

  protected renderContents = () => {
    const { user } = this.props;

    const src = user?.icon ?? noIcon;

    const listItems = [
      {
        icon: <ListAltIcon />,
        text: PAGE_NAMES.articles,
        link: MY_ARTICLES_LINK,
      },
      {
        icon: <ManageAccountsIcon />,
        text: PAGE_NAMES.accountSettings,
        link: ACCOUNT_SETTINGS_LINK,
      },
    ];

    return (
      <Stack spacing={3}>
        <BackToNavi text={SITE_NAME} link={MAP_PAGE_LINK} />

        <Typography align="center">ようこそ {user?.nickname}さん</Typography>
        <Stack direction="row">
          <Avatar sx={{ width: 80, height: 80, mx: 'auto' }} src={src} />
        </Stack>

        <LinkList list={listItems} />
      </Stack>
    );
  };
}

export type Props = {
  user?: User;
};

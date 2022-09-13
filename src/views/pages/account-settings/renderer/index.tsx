import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { AdminWrapper } from 'views/components/organisms/admin-wrapper';
import BadgeIcon from '@mui/icons-material/Badge';
import KeyIcon from '@mui/icons-material/Key';
import {
  ADMIN_LINK,
  PASSWORD_CHANGE_LINK,
  PROFILE_SETTINGS_LINK,
} from 'constant/links';
import { BackToNavi } from 'views/components/moleculars/back-to-navi';
import { LinkList } from 'views/components/moleculars/link-list';

export class Renderer extends React.Component {
  render() {
    return <AdminWrapper>{this.renderAccountSettingList()}</AdminWrapper>;
  }

  protected renderAccountSettingList = () => {
    const listItems = [
      {
        icon: <BadgeIcon />,
        text: 'プロフィール変更',
        link: PROFILE_SETTINGS_LINK,
      },
      { icon: <KeyIcon />, text: 'パスワード変更', link: PASSWORD_CHANGE_LINK },
    ];

    return (
      <Stack spacing={3}>
        <BackToNavi text="マイページ" link={ADMIN_LINK} />

        <Box>
          <Typography align="center" component="h2" variant="h4" sx={{ mb: 3 }}>
            アカウント設定
          </Typography>
          <LinkList list={listItems} />
        </Box>
      </Stack>
    );
  };
}

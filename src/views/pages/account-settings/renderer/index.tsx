import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { AdminWrapper } from 'views/components/organisms/admin-wrapper';
import BadgeIcon from '@mui/icons-material/Badge';
import KeyIcon from '@mui/icons-material/Key';
import { ADMIN_LINK, PASSWORD_CHANGE_LINK, PROFILE_SETTINGS_LINK } from 'constant/links';
import { BackToNavi } from 'views/components/moleculars/back-to-navi';
import { LinkList } from 'views/components/moleculars/link-list';
import { PAGE_NAMES } from 'constant/page-names';
import { HeadAppender } from 'helper-components/head-appender';
import { pageTitleGenerator } from 'utils/page-title-generator';

export class Renderer extends React.Component {
  render() {
    return (
      <HeadAppender title={pageTitleGenerator(PAGE_NAMES.accountSettings)}>
        <AdminWrapper>{this.renderAccountSettingList()}</AdminWrapper>
      </HeadAppender>
    );
  }

  protected renderAccountSettingList = () => {
    const listItems = [
      {
        icon: <BadgeIcon />,
        text: PAGE_NAMES.profileEdit,
        link: PROFILE_SETTINGS_LINK,
      },
      { icon: <KeyIcon />, text: PAGE_NAMES.passwordChange, link: PASSWORD_CHANGE_LINK },
    ];

    return (
      <Stack spacing={3}>
        <BackToNavi text={PAGE_NAMES.admin} link={ADMIN_LINK} />

        <Box>
          <Typography align="center" component="h2" variant="h4" sx={{ mb: 3 }}>
            {PAGE_NAMES.accountSettings}
          </Typography>
          <LinkList list={listItems} />
        </Box>
      </Stack>
    );
  };
}

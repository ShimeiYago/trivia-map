import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { AdminWrapper } from 'views/components/organisms/admin-wrapper';
import BadgeIcon from '@mui/icons-material/Badge';
import KeyIcon from '@mui/icons-material/Key';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { NonStyleLink } from 'views/components/atoms/non-style-link';
import { PASSWORD_CHANGE_LINK, PROFILE_SETTINGS_LINK } from 'constant/links';

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
    ].map((item, index) => (
      <NonStyleLink to={item.link} key={`account-setting-${index}`}>
        <ListItem>
          <ListItemButton>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
            <ListItemIcon>
              <KeyboardArrowRightIcon />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
      </NonStyleLink>
    ));

    return (
      <Stack spacing={3}>
        <Box>
          <Typography align="center" component="h2" variant="h4" sx={{ mb: 3 }}>
            アカウント設定
          </Typography>
          <List>{listItems}</List>
        </Box>
      </Stack>
    );
  };
}
